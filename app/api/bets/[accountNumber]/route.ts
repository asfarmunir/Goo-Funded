import { connectToDatabase } from "@/helper/dbconnect";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { accountNumber: string } }) {

    const { accountNumber } = params;
    
    // connect to database
    await connectToDatabase();

    // authenticate session
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json(
            { error: "You must be logged in to place a bet" },
            { status: 401 }
        );
    }

    // get user details
    const user = await prisma.user.findFirst({
        where: {
            email: session.user?.email
        }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // find account Id from account number
    const account = await prisma.account.findFirst({
        where: {
            accountNumber,
        },
    });

    if (!account) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    
    // find user bets
    try {
        const bets = await prisma.bets.findMany({
            where: {
                userId: user.id,
                accountId: account.id
            }
        });

        return NextResponse.json(bets);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch bets" }, { status: 500 });
    }

}