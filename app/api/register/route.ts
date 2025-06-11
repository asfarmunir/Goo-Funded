import { connectToDatabase } from "@/helper/dbconnect";
import { sendGreetingEmail } from "@/helper/mailgun";
import { generateReferralCode } from "@/helper/referral";
import prisma from "@/prisma/client";
import * as bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { firstName, lastName, country, email, password } = await req.json();
    const referrerCode = req.nextUrl.searchParams.get("referral");

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    let newUser;

    if (!referrerCode) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 409 }
        );
      }

      newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          country,
          email,
          password: hashedPassword,
          referralCode: generateReferralCode(),
        },
      });
    } else {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 409 }
        );
      }
      const referrer = await prisma.user.findFirst({
        where: { referralCode: referrerCode },
      });

      if (!referrer) {
        return NextResponse.json(
          { message: "Invalid referral code" },
          { status: 400 }
        );
      }

      newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          country,
          email,
          password: hashedPassword,
          referredBy: referrer.id,
          referralCode: generateReferralCode(),
        },
      });

      await prisma.$transaction([
        prisma.user.update({
          where: { id: referrer.id },
          data: { totalReferrals: { increment: 1 } },
        }),
      ]);

    }


    await sendGreetingEmail(email, firstName,password);

    return NextResponse.json({
      message: "User created successfully, confirmation email sent",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Error creating user", error: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
