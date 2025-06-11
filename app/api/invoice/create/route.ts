import { generateCustomId } from "@/helper/keyGenerator";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { NotificationType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
const coinbase = require("coinbase-commerce-node");
const { Client, resources } = coinbase;
const { Charge } = resources;

// coinbase payment invoice 
 
Client.init(process.env.COINBASE_COMMERCE_API_KEY);
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

    const chargeData = {
      name: `Invoice-${Date.now()}`,
      description: `Payment for Account Type: ${account.accountType}`,
      pricing_type: "fixed_price",
      local_price: {
        amount: Number(invoice.amount.replace("$", "")),
        currency: invoice.currencyFrom,
      },
      metadata: {
        customerEmail,
        accountDetails: {
          accountType: account.accountType,
          accountSize: account.accountSize,
          accountPrice: account.accountPrice,
          status: account.status,
          balance: parseInt(account.accountSize.replace("K", "000")),
          accountNumber: generateCustomId(),
          userId: user.id,
        },
        billingDetails,
      },
      // redirect_url: `https://play.goofunded.com/payment-success`,
      // cancel_url: `https://play.goofunded.com/payment-cancelled`,
    };

    const charge = await Charge.create(chargeData);

    // await prisma.accountInvoices.create({
    //   data: {
    //     userId: user.id,
    //     invoiceId: charge.id, // Coinbase charge ID
    //     amount: Number(invoice.amount.replace("$", "")),
    //     invoiceNumber: generateCustomId(false, false),
    //     paymentMethod: "Crypto",
    //     paymentDate: new Date(),
    //   },
    // });

     await prisma.accountInvoices.create({
          data: {
            eventId: charge.id,
            invoiceId: charge.code,
            invoiceNumber: charge.name,
            userId: user.id,
            amount: Number(charge.pricing?.local?.amount),
            status: "pending",
            paymentMethod: "Crypto",
            paymentDate: new Date(),
          },
        });

    // Create notification for the user
    await createNotification(
      "Invoice created successfully. Awaiting payment confirmation.",
      "UPDATE",
      user.id
    );

    return NextResponse.json(charge);
  } catch (error: any) {
    console.error("Error creating charge:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

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
