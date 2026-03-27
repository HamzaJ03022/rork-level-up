import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (envUrl && envUrl.length > 0) return envUrl;

  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return window.location.origin;
  }

  return "http://localhost:3000";
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: {},
      fetch: async (url, options) => {
        try {
          return await fetch(url, options as RequestInit);
        } catch (error) {
          console.error('[tRPC] Network error:', error);
          return new Response(
            JSON.stringify({ error: { message: 'Network error' } }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      },
    }),
  ],
});