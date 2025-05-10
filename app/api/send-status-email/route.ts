import { sendAccountBreachedEmail, sendAccountUnlockedEmail, sendContractAwaitsEmail, sendFundedAccountEmail, sendPhaseUpdateEmail, sendPickResultEmail } from "@/helper/mailgun";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    await connectToDatabase();
    
    // status = BREACHED, FUNDED, PHASE
    const { status, accountId, phaseNumber } = await req.json();

    // get account
    try {

        const account = await prisma.account.findUnique({
            where: {
                id: accountId
            }
        });
        if(!account) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: account.userId
            }
        });
        if(!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // send email
        if(status === "BREACHED") {
            await sendAccountBreachedEmail(user.email, `${user.firstName}`, account.accountNumber);
        } else if(status === "FUNDED"){
            await sendFundedAccountEmail(user.email, `${user.firstName}`, account.accountNumber);
        } else if(status === "PHASE") {
            await sendPhaseUpdateEmail(user.email, `${user.firstName}`, account.accountNumber, parseInt(phaseNumber));
        } else if(status === "BET_WIN") {
            await sendPickResultEmail(user.email, `${user.firstName}`, account.accountNumber, "WIN");
        } else if(status === "BET_LOSS") {
            await sendPickResultEmail(user.email, `${user.firstName}`, account.accountNumber, "LOSS");
        } else if(status === "CONTRACT") {
            await sendContractAwaitsEmail(user.email, `${user.firstName}`);
        } else if( status === "ACC_UNLOCKED" ) {
            await sendAccountUnlockedEmail(user.email);
        }
        else {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }
        return NextResponse.json({ message: "Email sent" }, { status: 200 });
    } catch(error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
}