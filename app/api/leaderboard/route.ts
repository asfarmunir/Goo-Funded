import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    // Fetch only accounts whose users have displayStatsLive set to true
    const accounts = await prisma.account.findMany({
      where: {
        status: "FUNDED",
        user: {
          displayStatsLive: true,  // Filter users directly with displayStatsLive
        },
      },
      select: {
        userId: true,
        totalFundedAmount: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileLevel: true,
            country: true,
          },
        },
      },
      orderBy: {
        totalFundedAmount: "desc",
      },
    });

    // Map leaderboard with user details
    const leaderboard = accounts.map((account, index) => {
      return {
        userId: account.userId,
        totalFundedAmount: account.totalFundedAmount,
        user: account.user,
        rank: index + 1, // Rank based on index
      };
    });

    return NextResponse.json(
      { leaderboard },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}