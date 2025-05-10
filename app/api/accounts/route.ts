import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "@/helper/dbconnect";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const authorized = await getServerSession(authOptions)
  
  if(!authorized) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: authorized.user?.email || ""
      }
    });
    
    const accounts = await prisma.account.findMany({
      where: {
        userId: user?.id
      }
    });
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch accounts" }, { status: 500 });
  }
}
