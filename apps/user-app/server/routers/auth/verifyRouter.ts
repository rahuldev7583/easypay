import { initTRPC } from "@trpc/server";
import { z } from "zod";
import prisma from "@repo/database";

const t = initTRPC.create();

const verificationRouter = t.router({
  verifyEmail: t.procedure
    .input(
      z.object({
        verificationCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { verificationCode } = input;

      const user = await prisma.user.findUnique({
        where: { verificationCode },
      });

      if (!user) {
        throw new Error("Invalid verification code");
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });

      return {
        message: "Email verified successfully",
        user: updatedUser.email,
      };
    }),
});

export type VerificationRouter = typeof verificationRouter;
export default verificationRouter;
