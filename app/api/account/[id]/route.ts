import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  
    const { id: accountId } = params;

    // connect to database
    await connectToDatabase();

    // find account by id
    const account = await prisma.account.findUnique({
        where: {
            id: accountId
        }
    });

    if (!account) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
}