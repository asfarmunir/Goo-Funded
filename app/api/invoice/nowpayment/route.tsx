import { generateCustomId } from "@/helper/keyGenerator";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { NotificationType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// NowPayments.io payment invoice
export async function POST(req: NextRequest) {
  try {
    const { customerEmail, invoice, account, billingDetails } =
      await req.json();

    await connectToDatabase();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user?.email,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare account details
    const accountDetails = {
      accountType: account.accountType,
      accountSize: account.accountSize,
      status: account.status,
      accountPrice: account.accountPrice,
      balance: parseInt(account.accountSize.replace("K", "000")),
      accountNumber: generateCustomId(),
      userId: user.id,
    };

    // Encode metadata into JSON string
    const metadata = {
      accountDetails,
      billingDetails,
      customerEmail,
    };

    const invoiceNumber = `Invoice-${Date.now()}`;
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "https://9747-103-149-240-162.ngrok-free.app"
        : "https://app.vantagepicks.com";

    // Create NowPayments.io invoice
    const nowPaymentsResponse = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: Number(invoice.amount.replace("$", "")),
        price_currency: invoice.currencyFrom,
        order_id: invoiceNumber,
        order_description: "Payment invoice for challenge account", // Metadata in JSON string
        ipn_callback_url: `${baseUrl}/api/webhook/nowpayments`, // Replace with your IPN callback URL
        success_url: baseUrl, // Replace with your success URL
        cancel_url: baseUrl, // Replace with your cancel URL
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY, // Your NowPayments.io API key
          "Content-Type": "application/json",
        },
      }
    );

    const invoiceData = nowPaymentsResponse.data;

    await prisma.accountInvoices.create({
      data: {
        eventId: invoiceData.id,
        invoiceId: invoiceData.order_id,
        invoiceNumber: invoiceNumber,
        userId: user.id,
        amount: Number(invoice.amount.replace("$", "")),
        status: "pending",
        paymentMethod: "Crypto",
        paymentDate: new Date(),
        metadata,
      },
    });

    await createNotification(
      "Invoice created successfully. Awaiting payment confirmation.",
      "UPDATE",
      user.id
    );

    return NextResponse.json(invoiceData);
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to create notifications
export const createNotification = async (
  message: string,
  type: NotificationType,
  userId: string
) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        content: message,
        type,
        userId: userId,
        read: false,
      },
    });

    const response = await fetch(
      `${process.env.BG_SERVICES_URL}/generate-notification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message: notification.content,
        }),
      }
    );

    if (!response.ok) {
      console.log(await response.text());
      throw new Error("Failed to create notification");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create notification");
  }
};
