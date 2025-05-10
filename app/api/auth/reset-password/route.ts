import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/helper/mailgun";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1-hour expiration

    // Save the token and expiry to the user record in the database
    await prisma.user.update({
      where: { email: email },
      data: {
        resetToken,
        resetTokenExpiry: new Date(resetTokenExpiry),
      },
    });

    // Generate the password reset link (fallback link)
    const resetLink = `${process.env.APP_URL}/login/reset-password/${user.id}?token=${resetToken}`;

    // Send the email with the reset link
    await sendPasswordResetEmail(email, resetLink);

    return NextResponse.json(
      { message: "Reset email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending reset email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
