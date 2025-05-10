// Nextjs GET APi

import { connectToDatabase } from "@/helper/dbconnect";
import { sendNotification } from "@/helper/notifications";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "You are not authenticated" },
      { status: 401 }
    );
  }

  try {
    // Check if user has completed KYC
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email,
      },
    });

    return NextResponse.json({ kycVerified: user?.kycVerified });
  } catch (error) {
    return NextResponse.json(
      { message: "Error verifying KYC" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "You are not authenticated" },
      { status: 401 }
    );
  }

  try {
    // Check if user has completed KYC
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user?.kycVerified) {
      return NextResponse.json(
        { message: "KYC already verified" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        email: session.user?.email,
      },
      data: {
        kycVerified: true,
      },
    });

    await sendNotification("Congratulations. Your KYC has been verified", "UPDATE", user.id);
    return NextResponse.json({ message: "KYC verified" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error verifying KYC" },
      { status: 500 }
    );
  }
}
