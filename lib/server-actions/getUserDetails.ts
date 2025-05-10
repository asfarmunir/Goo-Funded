import { connectToDatabase } from "@/helper/dbconnect";
import prisma from "@/prisma/client";

export const getUserDetails = async (email: string) => {
    await connectToDatabase();

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

 
 