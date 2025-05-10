import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    const { field, value } = await req.json();
    
    await connectToDatabase();

    const session = await getServerSession();
    if(!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {

        const user = await prisma.user.findFirst({
            where: {
                email: session.user?.email
            }
        });

        if(!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                [field]: value
            }
        })

        return NextResponse.json({ message: "User updated successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}