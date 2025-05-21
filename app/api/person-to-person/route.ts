import { NextRequest, NextResponse } from "next/server";
import { dateToFullCronString } from "@/lib/utils";
import { sendNotification } from "@/helper/notifications";
import { AccountStatus, AccountType, NotificationType } from "@prisma/client";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { generateCustomId } from "@/helper/keyGenerator";
import { sendAffiliateSaleEmail } from "@/helper/mailgun";
import { BONUS, LEVEL_1_TARGET, LEVEL_2_TARGET, REFER_COMMISSIONS } from "@/lib/constants";
import { getServerSession } from "next-auth";

type cronJobTypes = "objectiveMin" | "objectiveMax" | "inactivity";
interface cronJob {
  jobName: string;
  time: string;
  type: cronJobTypes;
  accountId: string;
}


async function createUserAccount(
  accountDetails: any,
  billingDetails: any,
  userId: string
) {
  console.log("🚀 ~ billingDetails:", billingDetails)
  console.log("accountDetails", accountDetails);

  const newAcc = await prisma.$transaction(async (prisma) => {
    // Step 1: Create the new account
    const createdAccount = await prisma.account.create({
      data: {
        accountType: accountDetails.accountType as AccountType,
        accountSize: accountDetails.accountSize,
        status: accountDetails.status as AccountStatus,
        balance: parseInt(accountDetails.accountSize.replace("K", "000")),
        // accountNumber: accountDetails.accountNumber,
        accountNumber: generateCustomId(),
        userId: userId,
        minBetPeriod: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxBetPeriod: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Step 2: Create the billing address linked to the account
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

  // enable it 
  try {
    await sendNotification("Account created successfully", "UPDATE", userId);
  } catch (error) {
    console.error("Error sending notification:", error);
  }

  return newAcc;
}

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
  // await connectToDatabase();
  try {
    const {
      account,
      billingDetailsData,
      paymentMethod,
      transactionId,
      paymentProof,
      email,
      userId,
    } = await req.json();

  


    await connectToDatabase();

      const session = await getServerSession();
      if (!session) {
        return NextResponse.json(
          { error: "You must be logged in to create an account" },
          { status: 401 }
        );
      }

      // Find user
      const user = await prisma.user.findFirst({
        where: {
          email: session.user?.email,
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }




      // Create User Account
      const newAccount = await createUserAccount(
        account,
        billingDetailsData,
        userId
      );
      // Create Account Invoice
      const accountInvoice = await prisma.accountInvoices.create({
        data: {
          invoiceNumber: `Invoice-${Date.now()}`,
          userId: userId,
          amount: parseFloat(account.accountPrice.replace("$", "")),
          status: "pending",
          paymentMethod: "p2p",
          paymentDate: new Date(),
          transactionId: transactionId,
            paymentProof: paymentProof,
            accountId: newAccount.id,
            
        },
      });

        // Crons to be added 
            //   const sevenday_cron_job: cronJob = {
            //     jobName: `${newAccount.id}_MIN_BET_PERIOD`,
            //     time: dateToFullCronString(newAccount.minBetPeriod),
            //     type: "objectiveMin",
            //     accountId: newAccount.id,
            //   };
            //   const objectiveMinJob =  await fetch(`${process.env.BG_SERVICES_URL}/add-cron-job`, {
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(sevenday_cron_job),
            //   });
            //   if (!objectiveMinJob.ok) {
            //     throw new Error(await objectiveMinJob.text());
            //   }
      
            //   // set CRON job for maximum Bet Period
            //   const thirtyday_cron_job: cronJob = {
            //     jobName: `${newAccount.id}_MAX_BET_PERIOD`,
            //     time: dateToFullCronString(newAccount.maxBetPeriod),
            //     type: "objectiveMax",
            //     accountId: newAccount.id,
            //   };
            //   const objectiveMaxJob = await fetch(`${process.env.BG_SERVICES_URL}/add-cron-job`, {
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(thirtyday_cron_job),
            //   });
            //   if (!objectiveMaxJob.ok) {
            //     throw new Error(await objectiveMaxJob.text());
            //   }


              // Give commission to referrer on first purchase
    //   const numberOfAccounts = await prisma.account.count({
    //     where: {
    //       userId: user.id,
    //     },
    //   });

    //   if (numberOfAccounts > 1) {
        console.log("Transaction Approved");

        return NextResponse.json({
        success: true,
        message: "Transaction Approved",
      });      
    // }


      await handleReferralCommission(user, account, accountInvoice);


      console.log("Transaction Approved");
      return NextResponse.json({
        success: true,
        message: "Transaction Approved",
      });
  } catch (error: any) {
  console.error("Transaction Error occurred:", error.message);
  return NextResponse.json(
    {
      success: false,
      message: error.message || "An unexpected error occurred",
    },
    { status: 400 } // Use 400 for client-side payment errors
  );
}

}



async function handleReferralCommission(user: any, account: any, accountInvoice: any) {
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
  const accountPrice = account.accountPrice.replace("$", "");

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
      orderValue: parseFloat(account.accountPrice.replace("$", "")),
      commission: commission * Number(accountPrice),
      orderNumber: accountInvoice.invoiceNumber,
    },
  });

  console.log("Referral Commission Created:", referral);

  await sendAffiliateSaleEmail(referrer.email, referrer.firstName, `$${referral.orderValue}`)
  await sendNotification(`You've earned a commission of $${referral.commission} from a referral.`, "UPDATE", referrer.id);
}
