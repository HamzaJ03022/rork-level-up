import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import haircutAnalyzeRoute from "./routes/haircut/analyze/route";
import beardAnalyzeRoute from "./routes/beard/analyze/route";
import aiAnalyzeAppearanceRoute from "./routes/ai/analyze-appearance/route";
import aiChatRoute from "./routes/ai/chat/route";

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
  ai: createTRPCRouter({
    analyzeAppearance: aiAnalyzeAppearanceRoute,
    chat: aiChatRoute,
  }),
});

export type AppRouter = typeof appRouter;