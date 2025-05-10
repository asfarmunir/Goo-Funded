import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../auth/authOptions";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  try {
    // get payment cards
    const paymentCard = await prisma.paymentCard.findFirst({
      where: {
        userId: user?.id,
      },
    });

    if (!paymentCard) {
      return NextResponse.json(
        { message: "No payment card found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ paymentCard }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch payment cards" },
      { status: 500 }
    );
  }
}
