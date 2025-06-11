import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/helper/mailgun";
import * as bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { valid: false, message: "Invalid Password!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { valid: true, message: "Valid Password!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating password:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
