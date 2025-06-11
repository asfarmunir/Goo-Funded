import { NextRequest, NextResponse } from "next/server";
import { sendNotification } from "@/helper/notifications";
import { AccountStatus, AccountType, NotificationType } from "@prisma/client";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { generateCustomId } from "@/helper/keyGenerator";
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
    await sendNotification("Account created successfully, Kindly wait for admin's payment approval.", "UPDATE", userId);
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
  try {
    const {
      account,
      billingDetailsData,
      transactionId,
      paymentProof,
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
       await prisma.accountInvoices.create({
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

        // Crons will be added through the /approval route when admin approves the user transaction.
           
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



