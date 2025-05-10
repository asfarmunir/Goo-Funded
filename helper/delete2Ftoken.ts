import prisma from "@/prisma/client"
import { connectToDatabase } from "./dbconnect"
import { NextResponse } from "next/server"

export const delete2Ftoken = async(email :string)=>{
    connectToDatabase()

const updatedUser = await prisma.user.update({
    where : {
        email : email
    },
    data : {
        ascii : null,
        otpUrl : null,
        twoFactorSecret : null
    }

   
}) 
console.log('this is the updated user after loggedin : ', updatedUser)

NextResponse.json(updatedUser)
}