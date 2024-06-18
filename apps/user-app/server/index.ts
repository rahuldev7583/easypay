import helloRouter from "./routers/hello";
import signupRouter from "./routers/auth/signupRouter";
import { router } from "./trpc";
import verificationRouter from "./routers/auth/verifyRouter";
import sessionRouter from "./routers/auth/sessionRouter";
import userRouter from "./routers/userRouter";
import addNumberRouter from "./routers/addNumber";

export const appRouter = router({
  hello: helloRouter,
  signupRouter: signupRouter,
  verification: verificationRouter,
  session: sessionRouter,
  user: userRouter,
  addNumberRouter: addNumberRouter,
});

export type AppRouter = typeof appRouter;
