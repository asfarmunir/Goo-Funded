import { NextRequest, NextResponse } from "next/server";
import { dateToFullCronString } from "@/lib/utils";
import { sendNotification } from "@/helper/notifications";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { sendAffiliateSaleEmail } from "@/helper/mailgun";
import { BONUS, LEVEL_1_TARGET, LEVEL_2_TARGET, REFER_COMMISSIONS } from "@/lib/constants";

type cronJobTypes = "objectiveMin" | "objectiveMax" | "inactivity";
interface cronJob {
  jobName: string;
  time: string;
  type: cronJobTypes;
  accountId: string;
}




export async function POST(req: NextRequest) {

    const { account, accountInvoice,email} = await req.json();
    console.log("🚀 ~ email:", email)
    // return NextResponse.json({
    //     success: true,
    //     message: "Transaction Approved",
    //   }); 
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
  try {

    await connectToDatabase();

      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }


              const sevenday_cron_job: cronJob = {
                jobName: `${account.id}_MIN_BET_PERIOD`,
                time: dateToFullCronString(new Date(account.minBetPeriod)), // Explicitly create Date object
                type: "objectiveMin",
                accountId: account.id,
              };
              const objectiveMinJob =  await fetch(`${process.env.BG_SERVICES_URL}/add-cron-job`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(sevenday_cron_job),
              });
              if (!objectiveMinJob.ok) {
                throw new Error(await objectiveMinJob.text());
              }
      
              // set CRON job for maximum Bet Period
              const thirtyday_cron_job: cronJob = {
                jobName: `${account.id}_MAX_BET_PERIOD`,
                time: dateToFullCronString(new Date(account.maxBetPeriod)), // Explicitly create
                type: "objectiveMax",
                accountId: account.id,
              };
              const objectiveMaxJob = await fetch(`${process.env.BG_SERVICES_URL}/add-cron-job`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(thirtyday_cron_job),
              });
              if (!objectiveMaxJob.ok) {
                throw new Error(await objectiveMaxJob.text());
              }


      const numberOfAccounts = await prisma.account.count({
        where: {
          userId: user.id,
        },
      });

      if (numberOfAccounts > 1) {

        return NextResponse.json({
        success: true,
        message: "Transaction Approved",
      });      
    }


      await handleReferralCommission(user, account, accountInvoice);

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
