// server/routers/userRouter.ts
import { initTRPC } from "@trpc/server";
import prisma from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/lib/auth";

const t = initTRPC.create();

const userRouter = t.router({
  getUser: t.procedure.query(async ({ ctx }) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),
});

export type UserRouter = typeof userRouter;
export default userRouter;
