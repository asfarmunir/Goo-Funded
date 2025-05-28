import { NextRequest, NextResponse } from "next/server";
import { dateToFullCronString } from "@/lib/utils";
import { sendNotification } from "@/helper/notifications";
import { connectToDatabase } from "@/lib/database";
import prisma from "@/prisma/client";
import { sendAffiliateSaleEmail } from "@/helper/mailgun";
import { BONUS, LEVEL_1_TARGET, LEVEL_2_TARGET, REFER_COMMISSIONS } from "@/lib/constants";

type cronJobTypes = "objectiveMin" | "objectiveMax" | "inactivity";
interface cronJob {
  jobName: string;
  time: string;
  type: cronJobTypes;
  accountId: string;
}




export async function POST(req: NextRequest) {

    const { account, accountInvoice,email} = await req.json();
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
  try {

    await connectToDatabase();

      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      await prisma.$transaction([
        prisma.billingAddress.deleteMany({
          where: { accountId: account.id }
        }),
        prisma.account.delete({
          where: { id: account.id }
        })
      ]);

      await sendNotification("Your account payment has been rejected by the admin.", "UPDATE", user.id);

     

        return NextResponse.json({
        success: true,
        message: "Transaction Approved",
      });      

  } catch (error: any) {
    
  console.error("Transaction Error occurred:", error.message);
  return NextResponse.json(
    {
      success: false,
      message: error.message || "An unexpected error occurred",
    },
    { status: 400 } // Use 400 for client-side payment errors
  );
}

}



