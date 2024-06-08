"use server";
import prisma from "@repo/database";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../../../../utils/emailVerification";

export async function POST(req: Request, res: Response) {
  try {
    const { name, email, number, password } = await req.json();
    console.log(req.json);

    const existingUser = await prisma.user.findFirst({ where: { email } });
    console.log(existingUser);

    if (existingUser) {
      return new Response("User already exits", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = uuidv4();

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        number,
        password: hashedPassword,
        isVerified: false,
        verificationCode,
      },
    });

    // return res.status(201).json({ message: "User created successfully", user: newUser }); // Return only necessary user data
    // return Response.json(
    //   {
    //     message: "User created successfully",
    //     user: newUser,
    //   },
    //   { status: 201 }
    // );
    await sendVerificationEmail(email, verificationCode);

    return new Response(
      "User created successfully. Please check your email for verification.",
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    return new Response(" Internal server error", { status: 500 });
  }
}
