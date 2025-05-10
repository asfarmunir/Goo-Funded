import { connectToDatabase } from "@/helper/dbconnect";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    await connectToDatabase();

    const session = await getServerSession();
    if(!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: session.user?.email
            }
        })
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get user" }, { status: 500 });
    }
    
}