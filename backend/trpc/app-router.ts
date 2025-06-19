import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import haircutAnalyzeRoute from "./routes/haircut/analyze/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  haircut: createTRPCRouter({
    analyze: haircutAnalyzeRoute,
  }),
});

export type AppRouter = typeof appRouter;