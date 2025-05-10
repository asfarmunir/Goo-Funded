import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/helper/dbconnect";
import { generateCustomId } from "@/helper/keyGenerator";
import { getServerSession } from "next-auth";
import {
  BONUS,
  LEVEL_1_TARGET,
  LEVEL_2_TARGET,
  REFER_COMMISSIONS,
} from "@/lib/constants";
import { dateToFullCronString } from "@/lib/utils";
import { sendNotification } from "@/helper/notifications";
import { sendAffiliateSaleEmail } from "@/helper/mailgun";

function generateInvoice(account: any, newAccount: any, userId: any) {
  // Strip $ from accountPrice
  const accountPrice = account.accountPrice.replace("$", "");

  const invoice = {
    amount: parseFloat(accountPrice),
    invoiceNumber: generateCustomId(false, false),
    accountId: newAccount.id,
    status: "paid",
    userId: userId,
    paymentMethod: "card",
    paymentDate: new Date(),
  };
  return invoice;
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

  await sendAffiliateSaleEmail(referrer.email, referrer.firstName, `$${referral.orderValue}`)
  await sendNotification(`You've earned a commission of $${referral.commission} from a referral.`, "UPDATE", referrer.id);
}

type cronJobTypes = "objectiveMin" | "objectiveMax" | "inactivity";
interface cronJob {
  jobName: string;
  time: string;
  type: cronJobTypes;
  accountId: string;
}

export async function POST(req: NextRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { account, billingDetails, card, userId } = await req.json();

    try {
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

      const startingBalance = parseFloat(
        account.accountSize.replace("K", "000")
      );

      // Use transaction to create account, billing address, and payment card
      const [newAccount, billingAddress, paymentCard, accountInvoice] = await prisma.$transaction(async (tx) => {
        // Create a new account linked to the user
        const newAccount = await tx.account.create({
          data: {
            accountSize: account.accountSize,
            accountType: account.accountType,
            status: account.status,
            balance: startingBalance,
            accountNumber: generateCustomId(),
            userId: user.id,
            minBetPeriod: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            maxBetPeriod: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            totalFundedAmount: 0,
          },
        });

        // Save billing address
        const billingAddress = await tx.billingAddress.create({
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
            accountId: newAccount.id,
          },
        });

        // Save payment card
        const existingCard = await tx.paymentCard.findFirst({
          where: {
            cardNumber: card.cardNumber,
            userId: user.id,
          },
        });

        let paymentCardId = existingCard?.id;
        if (!existingCard) {
          const paymentCard = await tx.paymentCard.create({
            data: {
              cardNumber: card.cardNumber,
              cardExpiry: card.cardExpiry,
              zipCode: card.zipCode,
              cardCvv: card.cardCvv,
              country: card.country,
              userId: userId,
              accountId: newAccount.id,
            },
          });

          paymentCardId = paymentCard.id;
        }

        if (!paymentCardId) {
          throw new Error("Failed to save payment card");
        }

        // Create account invoice
        const accountInvoice = await tx.accountInvoices.create({
          data: {
            ...generateInvoice(account, newAccount, userId),
            paymentCardId: paymentCardId,
            invoiceId: "",
          },
        });

        // set CRON job for minimum Bet Period
        const sevenday_cron_job: cronJob = {
          jobName: `${newAccount.id}_MIN_BET_PERIOD`,
          time: dateToFullCronString(newAccount.minBetPeriod),
          type: "objectiveMin",
          accountId: newAccount.id,
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
          jobName: `${newAccount.id}_MAX_BET_PERIOD`,
          time: dateToFullCronString(newAccount.maxBetPeriod),
          type: "objectiveMax",
          accountId: newAccount.id,
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

        return [newAccount, billingAddress, paymentCardId, accountInvoice];
      }, {
        timeout: 10000, // 10 seconds
      });

      // Give commission to referrer on first purchase
      const numberOfAccounts = await prisma.account.count({
        where: {
          userId: user.id,
        },
      });

      if (numberOfAccounts > 1) {
        return NextResponse.json({ newAccount }, { status: 200 });
      }

      await handleReferralCommission(user, account, accountInvoice);
      
      return NextResponse.json({ newAccount }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }
}
