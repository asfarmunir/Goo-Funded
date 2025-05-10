import { connectToDatabase } from "@/helper/dbconnect";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    
    // connect to db
    await connectToDatabase();

    // authenticate
    const session = await getServerSession();
    if (!session) {
        return { status: 401, json: { message: "Unauthorized" } };
    }

    // fetch user invoices
    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user?.email || '' },
        });

        const invoices = await prisma.accountInvoices.findMany({
            where: {
                userId: user?.id
            }
        });
        return NextResponse.json({ invoices }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
    }
}