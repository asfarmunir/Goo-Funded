import prisma from "@/prisma/client";
import { getServerSession } from "next-auth"; // Use getServerSession for next-auth in server-side
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../auth/authOptions";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { field, value } = await req.json();

    const user = await prisma.user.update({
      where: { email: session.user?.email || "" },
      data: {
        [field]: value,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" },
    });

    const preferences = {
      displayStatsLive: user?.displayStatsLive,
      phoneNotification: user?.phoneNotification,
      emailNotification: user?.emailNotification,
    };

    return NextResponse.json({ ...preferences }, { status: 200 });
  } catch (error) {
    // console.log(error)
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}
