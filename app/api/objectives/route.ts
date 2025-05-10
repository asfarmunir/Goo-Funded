import { connectToDatabase } from "@/lib/database";
import { checkObjectivesAndUpgrade } from "@/lib/utils";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    
    // connect to database
    await connectToDatabase();

    // get session
    const session = await getServerSession();
    if(!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user?.email;
    const user = await prisma.user.findFirst({
        where: {
            email: userEmail
        }
    });
    if(!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // fetch user account details
    const account = await prisma.account.findFirst({
        where: {
            userId: user.id
        }
    });

    // check if account exists
    if(!account) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    try {
        const newAccount = await checkObjectivesAndUpgrade(prisma, account);
        if(!newAccount) {
            return NextResponse.json({ error: "Not eligible for phase upgrade." }, { status: 200 });
        }
        return NextResponse.json(newAccount);
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }

    
}