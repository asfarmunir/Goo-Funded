import { NextRequest, NextResponse } from "next/server";
import { dateToFullCronString } from "@/lib/utils";
import { createNotification } from "@/app/api/invoice/create/route";
import { sendNotification } from "@/helper/notifications";
import { AccountStatus, AccountType } from "@prisma/client";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";

// Load the Authorize.Net signature key from environment variables
const authorizeNetSignatureKey = process.env.AUTHORIZENET_SIGNATURE_KEY;

// async function createUserAccount(accountDetails:any, billingDetails:any) {
//   return await prisma.$transaction(async (prisma) => {
//     // Step 1: Create the new account
//     const createdAccount = await prisma.account.create({
//       data: {
//         accountType: accountDetails.accountType,
//         accountSize: accountDetails.accountSize,
//         status: accountDetails.status,
//         balance: accountDetails.balance,
//         accountNumber: accountDetails.accountNumber,
//         userId: accountDetails.userId,
//         minBetPeriod: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
//         maxBetPeriod: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
//       },
//     });

//     // Step 2: Create the billing address linked to the account
//     await prisma.billingAddress.create({
//       data: {
//         address: billingDetails.address,
//         city: billingDetails.city,
//         country: billingDetails.country,
//         email: billingDetails.email,
//         firstName: billingDetails.firstName,
//         lastName: billingDetails.lastName,
//         phone: billingDetails.phone,
//         zipCode: billingDetails.postalCode,
//         state: billingDetails.state,
//         accountId: createdAccount.id,
//       },
//     });

//     return createdAccount;
//   });
// }

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // console.log("rawBody", rawBody)
    // console.log("signature", signature)
    // await connectToDatabase();


    // console.log("Webhook signature verified");

    const event = JSON.parse(rawBody);
    console.log("event", event);
    

    // Validate event payload
    if (!event || !event.eventType || !event.payload) {
      console.error("Invalid webhook payload");
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const eventType = event.eventType;
    // const transactionId = event.payload.id;
    const responseCode = event.payload.responseCode;

    let transactionStatus;
    switch (responseCode) {
      case 1:
        transactionStatus = "Approved";
        break;
      case 2:
        transactionStatus = "Declined";
        break;
      case 3:
        transactionStatus = "Error";
        break;
      case 4:
        transactionStatus = "Held for Review";
        break;
      default:
        transactionStatus = "Unknown";
    }

    // console.log(`Transaction ${transactionId} status: ${transactionStatus}`);

    if (
      eventType === "net.authorize.payment.authcapture.created" ||
      eventType === "net.authorize.payment.priorAuthCapture.created"
    ) {
      //   const payment = await prisma.payment.findUnique({ where: { transactionId } });

      return NextResponse.json({ success: true, message: "Webhook processed" });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
