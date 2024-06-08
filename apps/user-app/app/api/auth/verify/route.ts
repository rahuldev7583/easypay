"use server";
import { type NextRequest, type NextResponse } from "next/server";
import prisma from "@repo/database";

export async function GET(req: NextRequest, res: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const verificationCode = searchParams.get("verificationCode");
    console.log(verificationCode);

    if (!verificationCode) {
      return new Response("Missing verification code", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { verificationCode },
    });

    if (!user) {
      return new Response("Invalid verification code", { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    return new Response("Email verified successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
