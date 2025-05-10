import { NextResponse, NextRequest } from "next/server";
import speakeasy from "speakeasy";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../authOptions";

export async function POST(request: NextRequest) {
  try {
    const { token, twoFa } = await request.json();
    const session = await getServerSession(AuthOptions);
    if(!session){
        return NextResponse.json({
            message :'Unauthorized'
        }, {status : 401})
    }
    const verified = speakeasy.totp.verify({
        secret : twoFa,
        encoding : 'base32',
        token : token,
    })
    if(!verified){
        return NextResponse.json({
            message :'user is not verified'
        }, {status : 400})
    }

    return NextResponse.json({verified})

  } catch (error) {
    return NextResponse.json(
        { message: "An error occurred", error },
        { status: 500 }
      );
  }
}