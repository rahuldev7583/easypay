import { initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../app/lib/auth";

const t = initTRPC.create();

const sessionRouter = t.router({
  getSession: t.procedure.mutation(async () => {
    const session = await getServerSession(authOptions);

    if (session?.user) {
      return {
        user: session.user,
      };
    }

    return NextResponse.json(
      {
        message: "You are not logged in",
      },
      {
        status: 403,
      }
    );
  }),
});

export type SessionRouter = typeof sessionRouter;
export default sessionRouter;
