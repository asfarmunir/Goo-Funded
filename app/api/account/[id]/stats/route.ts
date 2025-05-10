import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id: accountId } = params;

    if(!accountId) {
        return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }
    
    try {
        // connect to database
        await connectToDatabase();

        // find account by id
        const account = await prisma.account.findUnique({
            where: { id: accountId }
        });

        if (!account) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        // account stats
        const numberOfPicks = await prisma.bets.count({ where: { accountId } });
        const numberOfWins = await prisma.bets.count({
            where: { accountId, betResult: "WIN" }
        });
        const numberOfLosses = await prisma.bets.count({
            where: { accountId, betResult: "LOSE" }
        });

        const numberOfResults = numberOfWins + numberOfLosses || 1;
        const winRate = numberOfPicks > 0 ? (numberOfWins / numberOfResults) * 100 : 0;
        const lossRate = numberOfPicks > 0 ? (numberOfLosses / numberOfResults) * 100 : 0;

        const averagePickSize = await prisma.bets.aggregate({
            where: { accountId },
            _avg: { pick: true }
        });

        const averageProfitPerPick = await prisma.bets.aggregate({
            where: { accountId, betResult: "WIN" },
            _avg: { winnings: true }
        });

        const averageOdds = await prisma.bets.aggregate({
            where: { accountId },
            _avg: { odds: true }
        });

        const highestWinningPick = await prisma.bets.findFirst({
            where: { accountId, betResult: "WIN" },
            orderBy: { winnings: "desc" }
        });

        const accountStats = [
            {
                title: "Number of Picks",
                value: numberOfPicks,
            },
            {
                title: "Highest Winning Pick",
                value: `$${highestWinningPick ? highestWinningPick.winnings.toFixed(2) : 0}`,
            },
            {
                title: "Picks Won",
                value: numberOfWins,
            },
            {
                title: "Picks Lost",
                value: numberOfLosses,
            },
            {
                title: "Win Rate",
                value: `${winRate.toFixed(2)}%`,
            },
            {
                title: "Loss Rate",
                value: `${lossRate.toFixed(2)}%`,
            },
            {
                title: "Average Pick Size",
                value: `$${averagePickSize._avg.pick ? averagePickSize._avg.pick.toFixed(2) : 0}`,
            },
            {
                title: "Average profit per pick",
                value: `$${averageProfitPerPick._avg.winnings ? averageProfitPerPick._avg.winnings.toFixed(2) : 0}`,
            },
            {
                title: "Average Odds",
                value: averageOdds._avg.odds ? averageOdds._avg.odds.toFixed(2) : 0,
            }
        ];

        return NextResponse.json(accountStats);
    } catch (error) {
        console.error("Error fetching account stats:", error);

        // If the error is related to the Prisma client
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ error: "A database error occurred." }, { status: 500 });
        }

        // Other unknown errors
        return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
    }
}
