import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import haircutAnalyzeRoute from "./routes/haircut/analyze/route";
import beardAnalyzeRoute from "./routes/beard/analyze/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  haircut: createTRPCRouter({
    analyze: haircutAnalyzeRoute,
  }),
  beard: createTRPCRouter({
    analyze: beardAnalyzeRoute,
  }),
});

export type AppRouter = typeof appRouter;