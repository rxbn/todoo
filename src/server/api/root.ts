import { createTRPCRouter } from "~/server/api/trpc";
import { todoRouter } from "./routers/todos";
import { tagRouter } from "./routers/tags";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  todos: todoRouter,
  tags: tagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
