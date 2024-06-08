"use server";
import prisma from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 400 });
  }

  try {
    if (!session || !session.user || !session.user.email) {
      return new Response("Unauthorized", { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email },
    });

    return Response.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);

    return Response.json({ message: "Error fetching user data" });
  }
}
