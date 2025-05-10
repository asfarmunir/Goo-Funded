import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDatabase();

    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: accountId } = params;
    console.log("🚀 ~ GET ~ accountId:", accountId);

    if (!accountId) {
        return NextResponse.json({ message: "Account ID is required" }, { status: 400 });
    }

    if (!ObjectId.isValid(accountId)) {
        return NextResponse.json({ message: "Invalid Account ID format" }, { status: 400 });
    }

    try {
        const account = await prisma.account.findUnique({
            where: { id: accountId.toString() } // ✅ Ensure correct format for Prisma
        });

        if (!account) {
            return NextResponse.json({ message: "Account not found" }, { status: 404 });
        }

        const graphData = await prisma.balanceHistory.findMany({
            where: { accountId },
            select: {
                balance: true,
                date: true
            },
            orderBy: { createdAt: "asc" }
        });

        console.log("🚀 ~ GET ~ graphData:", graphData);

        const formattedGraphData = graphData.length
            ? graphData.map((data) => ({
                balance: data.balance,
                date: formatDate(new Date(data.date))
            }))
            : [];

        return NextResponse.json(formattedGraphData, { status: 200 });
    } catch (error) {
        console.log("🚀 ~ GET ~ error", error);
        return NextResponse.json({ message: "Error fetching graph data" }, { status: 500 });
    }
}
