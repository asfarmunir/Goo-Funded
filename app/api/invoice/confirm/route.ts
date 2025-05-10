// pages/api/webhook.js


// webhook response of the confirmo API

import { sendNotification } from "@/helper/notifications";
import { dateToFullCronString } from "@/lib/utils";
import prisma from "@/prisma/client";
import { AccountStatus, AccountType } from "@prisma/client";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

type cronJobTypes = "objectiveMin" | "objectiveMax" | "inactivity";
interface cronJob {
  jobName: string;
  time: string;
  type: cronJobTypes;
  accountId: string;
}

// Your callback password
const CALLBACK_PASSWORD = process.env.CALLBACK_PASS;

// Webhook handler for payment notifications
export async function POST(req: NextRequest) {
  const body = await req.json();
  // const { invoice } = body;

  try {
    // Step 1: Verify the signature
    const isValidSignature = verifySignature(
      body,
      req.headers.get("bp-signature")
    );
    
    console.log("isValidSignature", isValidSignature);
    
    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Step 2: Check if the payment is successful
    if (body.status === "paid") {
      // Extract user info (if necessary) from the invoice
      const reference = body.reference;

      try {
        // Create the user account
        const newAccount = await createUserAccount(reference);

        await prisma.accountInvoices.updateMany({
          where: {
            invoiceId: body.invoiceId, 
          },
          data: {
            status: "paid",
          }
        })

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

      } catch (error) {
        console.error("Error creating user account:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
      }

      // Step 3: Return a 200 response to acknowledge successful processing
      return NextResponse.json({
        message: "User account created successfully",
      });
    } else {
      // Handle other statuses (e.g., payment failed)
      return NextResponse.json(
        { message: "Payment not successful" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Function to verify the webhook request signature
function verifySignature(body: any, receivedSignature: any) {
  const bodyString = JSON.stringify(body);
  const signatureString = `${bodyString}${CALLBACK_PASSWORD}`;

  console.log("Signature String: ", signatureString);
  console.log("Callback Pass: ", CALLBACK_PASSWORD);
  // Generate SHA256 hash
  const expectedSignature = crypto
    .createHash("sha256")
    .update(signatureString)
    .digest("hex");

  // Compare with the signature received in the webhook header
  console.log("Expected Signature: ", expectedSignature);
  console.log("Received Signature: ", receivedSignature);
  return expectedSignature === receivedSignature;
}

async function createUserAccount(reference: any) {
  const accountDetails = JSON.parse(reference).accountDetails;
  const billinDetails = JSON.parse(reference).billingDetails;

  const newAcc = await prisma.$transaction(async (prisma) => {
    // Step 1: Create the new account
    const createdAccount = await prisma.account.create({
      data: {
        accountType: accountDetails.accountType as AccountType,
        accountSize: accountDetails.accountSize as string,
        status: accountDetails.status as AccountStatus,
        balance: accountDetails.balance as number,
        accountNumber: accountDetails.accountNumber as string,
        userId: accountDetails.userId,
        minBetPeriod: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxBetPeriod: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });
  
    // Step 2: Create the billing address linked to the account
    await prisma.billingAddress.create({
      data: {
        address: billinDetails.address,
        city: billinDetails.city,
        country: billinDetails.country,
        email: billinDetails.email,
        firstName: billinDetails.firstName,
        lastName: billinDetails.lastName,
        phone: billinDetails.phone,
        zipCode: billinDetails.postalCode,
        state: billinDetails.state,
        accountId: createdAccount.id, // Link to the newly created account
      },
    });
    
    return createdAccount; // Return the created account
  });

  try {
    await sendNotification("Account created successfully", "UPDATE", accountDetails.userId);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
  
  return newAcc;
}
