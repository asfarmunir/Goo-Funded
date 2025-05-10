import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { accountId: string } }) {
    
    const { accountId } = params;

    await connectToDatabase();
    
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json(
            { error: "You must be logged in to view account history" },
            { status: 401 }
        );
    }

    try {

        // get user
        const user = await prisma.user.findFirst({
            where: {
                email: session.user?.email,
            },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        // get account
        const account = await prisma.account.findFirst({
            where: {
                id: accountId,
                userId: user.id
            }
        });
        if (!account) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        // get funded payouts
        const fundedPayouts = await prisma.fundedPayoutRequests.findMany({
            where: {
                accountId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(fundedPayouts);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

}