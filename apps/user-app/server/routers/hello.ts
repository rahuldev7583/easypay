// server/routers/hello.ts
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

const helloRouter = t.router({
  greet: t.procedure.query(() => {
    return "Hello World!";
  }),
});

export type HelloRouter = typeof helloRouter;
export default helloRouter;
