"use server";
import prisma from "@repo/database";
import { authOptions } from "../../lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();
  const number = data.number;

  if (!session?.user?.email) {
    return new Response("No user found in session", { status: 200 });
  }
  try {
    const user = await prisma.user.update({
      where: { email: session?.user?.email },
      data: { number: number },
    });
    return Response.json({ message: "Phone number updated successfully!" });
  } catch (error) {
    console.error("Error updating phone number:", error);
    return Response.json({ message: "Error updating phone number" });
  }
}
