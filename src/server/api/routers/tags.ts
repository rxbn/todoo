import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

export const tagRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.tag.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return result;
  }),

  getByTodo: protectedProcedure
    .input(z.object({ todoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.tag.findMany({
        where: {
          userId: ctx.session.user.id,
          todos: {
            some: {
              id: input.todoId,
            },
          },
        },
      });
      return result;
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.session.user.id);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const tag = await ctx.prisma.tag.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });

      return tag;
    }),

  edit: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.tag.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.tag.delete({
        where: {
          id: input.id,
        },
      });
      return result;
    }),

  search: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.tag.findMany({
        where: {
          userId: ctx.session.user.id,
          name: {
            contains: input.search,
          },
        },
      });
      return result;
    }),
});
