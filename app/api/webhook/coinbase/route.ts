import { NextRequest, NextResponse } from "next/server";
const coinbase = require("coinbase-commerce-node");
import { dateToFullCronString } from "@/lib/utils";
import { sendNotification } from "@/helper/notifications";
import { AccountStatus, AccountType } from "@prisma/client";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { BONUS, LEVEL_1_TARGET, LEVEL_2_TARGET, REFER_COMMISSIONS } from "@/lib/constants";
import { sendAffiliateSaleEmail } from "@/helper/mailgun";
import { getServerSession } from "next-auth";

const { Webhook } = coinbase;
const webhookSecret = process.env.COINBASE_COMMERCE_SHARED_SECRET;

async function createUserAccount(accountDetails: any, billingDetails: any) {
  const newAcc = await prisma.$transaction(async (prisma) => {
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

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-cc-webhook-signature");

    await connectToDatabase();
    console.log("🚀 ~ Webhook triggered");
 

    let event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    console.log("Received Event:", event);

    // Extract invoice data safely
    const { data } = event;
    const eventId = data?.id;
    const invoiceId = data?.code;
    const userId = data?.metadata?.accountDetails?.userId;

  
    const existingPaidInvoice = await prisma.accountInvoices.findFirst({
      where: {
        invoiceId,
        status: "paid",
      },
    });

    if (existingPaidInvoice) {
      console.log("🚀 ~ Invoice already paid", existingPaidInvoice)
      return NextResponse.json({ success: true, id: event.id });
    }

  

      // Find user
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }


    // Only process successful payments
    if (event.type === "charge:confirmed") {
      console.log("🚀 ~ Charge Confirmed", event);

      // Parse metadata JSON strings
      const accountDetails = JSON.parse(data.metadata.accountDetails);
      const billingDetails = JSON.parse(data.metadata.billingDetails);

      try {


         const newAccount = await prisma.$transaction(async (prisma) => {
          // Update the invoice status to "paid" and store the eventId
          await prisma.accountInvoices.updateMany({
            where: { invoiceId },
            data: { status: "paid" },
          });

          // Create the user account
          const createdAccount = await createUserAccount(accountDetails, billingDetails);

          return createdAccount;
        });

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
        console.error("🚀 Error processing charge:confirmed event:", error);
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
        const invoiceNumber = data.name;
      await handleReferralCommission(user, accountDetails, invoiceNumber);
           }


    }

    if (event.type === "charge:pending") {
      console.log("🚀 ~ Charge Pending", event);
    }

    if (event.type === "charge:failed") {
      console.log("🚀 ~ Charge Failed", event);
      
      await prisma.accountInvoices.updateMany({
        where: { invoiceId },
        data: { status: "failed" },
      });
    }



    return NextResponse.json({ success: true, id: event.id });
  } catch (error) {
    console.error("🚀 Webhook Processing Error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 400 }
    );
  }
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
