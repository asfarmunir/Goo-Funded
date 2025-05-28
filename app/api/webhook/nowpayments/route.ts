import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import crypto from "crypto";
import { AccountStatus, AccountType } from "@prisma/client";
import { sendNotification } from "@/helper/notifications";
import { dateToFullCronString } from "@/lib/utils";
import { sendAffiliateSaleEmail } from "@/helper/mailgun";
import { BONUS, LEVEL_1_TARGET, LEVEL_2_TARGET, REFER_COMMISSIONS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {

    console.log('!!!!!!!!Payment webhook received.');

    // Parse request body
    const body = await req.json();
    const nowPaymentsSignature = req.headers.get("x-nowpayments-sig");

    if (!nowPaymentsSignature) {
      return NextResponse.json(
        { error: "Missing signature in headers" },
        { status: 400 }
      );
    }

    // Verify signature
    const isValidSignature = verifySignature(body, nowPaymentsSignature);
    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid signature. Unauthorized request." },
        { status: 403 }
      );
    }
    await connectToDatabase();
    const { order_id, payment_status } = body;

     const existingPaidInvoice = await prisma.accountInvoices.findFirst({
      where: {
        invoiceId: order_id,
        status: "paid",
      },
    });

    if (existingPaidInvoice) {
      console.log("🚀 ~ Invoice already paid", existingPaidInvoice)
      return NextResponse.json({ success: true, message: "Invoice already paid" });
    }


    // Extract relevant data
    console.log("🚀 ~ POST ~ body:", body)

    // Find the invoice in the database
    const invoice = await prisma.accountInvoices.findFirst({
      where: { invoiceId: order_id },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }
    //@ts-ignore
    const userId = invoice?.metadata?.accountDetails?.userId;


     const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

    // Process only if the payment is successful
    if (payment_status === "finished") {
      
      
      //@ts-ignore
         const accountDetails = invoice.metadata?.accountDetails;
         //@ts-ignore
        const billingDetails = invoice.metadata?.billingDetails;

        if (!accountDetails || !billingDetails) {
        return NextResponse.json(
            { error: "Missing account or billing details in invoice metadata" },
            { status: 400 }
        );
            }

      try {


         const newAccount = await prisma.$transaction(async (prisma) => {
          // Update the invoice status to "paid" and store the eventId
          await prisma.accountInvoices.updateMany({
            where: { invoiceId : order_id },
            data: { status: "paid" },
          });

          // Create the user account
        //   const createdAccount = await createUserAccount(accountDetails, billingDetails);
            const createdAccount = await prisma.account.create({
            data: {
                accountType: accountDetails.accountType as AccountType,
                accountSize: accountDetails.accountSize as string,
                status: accountDetails.status as AccountStatus,
                balance: accountDetails.balance as number,
                accountNumber: accountDetails.accountNumber as string,
                userId: accountDetails.userId,
                minBetPeriod: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                maxBetPeriod: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
                isApproved: true, 
            },
            });

            await prisma.billingAddress.create({
            data: {
                address: billingDetails.address,
                city: billingDetails.city,
                country: billingDetails.country,
                email: billingDetails.email,
                firstName: billingDetails.firstName,
                lastName: billingDetails.lastName,
                phone: billingDetails.phone,
                zipCode: billingDetails.postalCode,
                state: billingDetails.state,
                accountId: createdAccount.id,
            },
            });
                return createdAccount;
                });


            await sendNotification(
            "Account created successfully!",
        "UPDATE",
            accountDetails.userId
                );
      

        // Set CRON jobs for min/max bet periods
        const cronJobs = [
          {
            jobName: `${newAccount.id}_MIN_BET_PERIOD`,
            time: dateToFullCronString(newAccount.minBetPeriod),
            type: "objectiveMin",
            accountId: newAccount.id,
          },
          {
            jobName: `${newAccount.id}_MAX_BET_PERIOD`,
            time: dateToFullCronString(newAccount.maxBetPeriod),
            type: "objectiveMax",
            accountId: newAccount.id,
          },
        ];

        for (const cronJob of cronJobs) {
          const response = await fetch(
            `${process.env.BG_SERVICES_URL}/add-cron-job`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(cronJob),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to create CRON job: ${await response.text()}`);
          }
        }
      } catch (error) {
        console.error("🚀 Error processing payment ", error);
        return NextResponse.json(
          { success: false, error: "Error processing payment" },
          { status: 400 }
        );
      }

       const numberOfAccounts = await prisma.account.count({
        where: {
          userId: user.id,
        },
      });

      if (numberOfAccounts === 1) {
        const invoiceNumber = order_id;
         await handleReferralCommission(user, accountDetails, invoiceNumber);
         }

      console.log('!!!!!!!!Payment verified, account created.');
      return NextResponse.json({success: true,  message: "Payment verified, account created." });
    }
    if (payment_status === "failed" || payment_status === "expired") {
      console.log('!!!!!!!!Payment status not completed.');
      return NextResponse.json({ success: true, message: "Payment status not completed or expired." });

    }
    return NextResponse.json({ success: true, message: "Payment status not completed." });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}


function verifySignature(body: any, signature: string): boolean {
  const notificationsKey = process.env.NOWPAYMENTS_IPN_SECRET || "";
  const hmac = crypto.createHmac("sha512", notificationsKey);
  hmac.update(JSON.stringify(sortObject(body)));
  const computedSignature = hmac.digest("hex");
  return computedSignature === signature;
}
function sortObject(obj: any) {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key) => {
      result[key] = obj[key] && typeof obj[key] === "object" ? sortObject(obj[key]) : obj[key];
      return result;
    }, {});
}
async function handleReferralCommission(user: any, accountDetails: any, invoiceNumber: any) {
  const referrerId = user.referredBy;
  if (!referrerId) {
    return null;
  }

  const referrer = await prisma.user.findFirst({
    where: {
      id: referrerId,
    },
  });

  if (!referrer) {
    return null;
  }

  const totalReferrals = referrer.totalReferrals;
  console.log("🚀 ~ handleReferralCommission ~ totalReferrals:", totalReferrals)

  // Determine referral level
  let referralLevel: "level1" | "level2" | "level3" = "level1";
  if (totalReferrals < LEVEL_1_TARGET) {
    referralLevel = "level1";
  } else if (totalReferrals < LEVEL_2_TARGET) {
    referralLevel = "level2";
  } else {
    referralLevel = "level3";
  }

  const levelInformation = REFER_COMMISSIONS[referralLevel];
  const commission = levelInformation.commission;
  const bonus =
    totalReferrals === REFER_COMMISSIONS["level1"].target ? BONUS : 0;
  const accountPrice = accountDetails.accountPrice.replace("$", "");

  const newTotalEarned =
  referrer.totalEarned + (commission * Number(accountPrice)) + bonus;
  console.log("🚀 ~ handleReferralCommission ~ newTotalEarned:", newTotalEarned)

  // Update referrer's earnings
  await prisma.user.update({
    where: {
      id: referrer.id,
    },
    data: {
      totalEarned: newTotalEarned,
    },
  });

  // Create a new commission record
  const referral =  await prisma.referralHistory.create({
    data: {
      userId: user.id,
      referredUserId: referrer.id,
      status: "paid",
      orderValue: parseFloat(accountDetails.accountPrice.replace("$", "")),
      commission: commission * Number(accountPrice),
      orderNumber: invoiceNumber,
    },
  });

  console.log("Referral Commission Created:", referral);

  await sendAffiliateSaleEmail(referrer.email, referrer.firstName, `$${referral.orderValue}`)
  await sendNotification(`You've earned a commission of $${referral.commission} from a referral.`, "UPDATE", referrer.id);
}
// this logic has been directly added into a transaction above
async function createUserAccount(accountDetails: any, billingDetails: any) {
  const newAcc =
   await prisma.$transaction(async (prisma) => {
    const createdAccount = await prisma.account.create({
      data: {
        accountType: accountDetails.accountType as AccountType,
        accountSize: accountDetails.accountSize as string,
        status: accountDetails.status as AccountStatus,
        balance: accountDetails.balance as number,
        accountNumber: accountDetails.accountNumber as string,
        userId: accountDetails.userId,
        minBetPeriod: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        maxBetPeriod: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.billingAddress.create({
      data: {
        address: billingDetails.address,
        city: billingDetails.city,
        country: billingDetails.country,
        email: billingDetails.email,
        firstName: billingDetails.firstName,
        lastName: billingDetails.lastName,
        phone: billingDetails.phone,
        zipCode: billingDetails.postalCode,
        state: billingDetails.state,
        accountId: createdAccount.id,
      },
    });

    return createdAccount;
  });

  try {
    await sendNotification(
      "Account created successfully!",
      "UPDATE",
      accountDetails.userId
    );
  } catch (error) {
    console.error("Error sending notification:", error);
  }
  return newAcc;
}


