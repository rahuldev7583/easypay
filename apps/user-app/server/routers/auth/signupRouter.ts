import { initTRPC } from "@trpc/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import prisma from "@repo/database";
import { sendVerificationEmail } from "../../../utils/emailVerification";
import { z } from "zod";

const t = initTRPC.create();

const signupRouter = t.router({
  signup: t.procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        number: z.string(),
        password: z.string().min(5),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, number, password } = input;

      const existingUser = await prisma.user.findFirst({ where: { email } });
      if (existingUser) {
        throw new Error("User already exists");
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

      await sendVerificationEmail(email, verificationCode);

      return {
        message:
          "User created successfully. Please check your email for verification.",
        user: newUser.email,
      };
    }),
});

export type SignupRouter = typeof signupRouter;
export default signupRouter;
