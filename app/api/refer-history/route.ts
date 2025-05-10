import { connectToDatabase } from "@/helper/dbconnect";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    
    await connectToDatabase();

    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
        where: {
            email: session.user?.email,
        },
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const referrals = await prisma.referralHistory.findMany({
        where: {
            referredUserId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(referrals);
}