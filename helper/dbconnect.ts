import prisma from "@/prisma/client";


export const connectToDatabase = async () =>{
    try {
        const connectedToDb = await prisma.$connect();
        console.log('this is the connection : ', connectedToDb)
    } catch (error) {
        console.log('this is the error : ', error)
        throw new Error('Unable to connect ot database')
    }
}