import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { verifyToken } from "@clerk/backend";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const authHeader = opts.req.headers.get("authorization");
  let userId: string | null = null;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    
    try {
      const secretKey = process.env.CLERK_SECRET_KEY;
      if (!secretKey) {
        console.error("Missing CLERK_SECRET_KEY");
        throw new Error("Server configuration error");
      }

      const verified = await verifyToken(token, {
        secretKey,
      });
      
      userId = verified.sub;
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }

  return {
    req: opts.req,
    userId,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});