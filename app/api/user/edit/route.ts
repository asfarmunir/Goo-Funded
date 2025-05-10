import { connectToDatabase } from "@/helper/dbconnect";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    
    await connectToDatabase();
    
    const { user, userId } = await req.json();

    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...user
            }
        })   
        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
    }
    
}