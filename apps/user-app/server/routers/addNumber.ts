import { initTRPC } from "@trpc/server";
import prisma from "@repo/database";
import { authOptions } from "../../app/lib/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";

const t = initTRPC.create();

// Define the router
const addNumberRouter = t.router({
  addNumber: t.procedure
    .input(z.object({ number: z.string().min(10) }))
    .mutation(async ({ input, ctx }) => {
      const { number } = input;

      // Fetch session to get the current user
      const session = await getServerSession(authOptions);

      if (!session || !session.user || !session.user.email) {
        throw new Error("No user found in session");
      }

      try {
        // Update user's phone number in the database
        const user = await prisma.user.update({
          where: { email: session.user.email },
          data: { number: number },
        });

        return { message: "Phone number updated successfully!", user };
      } catch (error) {
        console.error("Error updating phone number:", error);
        throw new Error("Error updating phone number");
      }
    }),
});

export type addNumberRouter = typeof addNumberRouter;
export default addNumberRouter;
