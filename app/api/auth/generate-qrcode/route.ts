import { NextResponse, NextRequest } from "next/server";
import speakeasy from "speakeasy";
import QRcode from "qrcode";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);
    const user = await prisma.user.findFirst({
        where : {
            email : session?.user?.email!
        }
    })
return NextResponse.json({qrcode : user?.otpUrl , twofactorsecret : user?.twoFactorSecret});
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
