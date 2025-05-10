import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Missing required id field" },
        { status: 400 }
      );
    }

    const updateData = {} as any;

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    // if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phoneNumber = data.phone;
    if (data.address) updateData.address = data.address;
    // if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: "Server error" },
      { status: 500 }
    );
  }
}


