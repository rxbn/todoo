import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ done: z.boolean() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.todo.findMany({
        where: {
          done: input.done,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.create({
        data: {
          content: input.content,
        },
      });

      return todo;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });
      return todo;
    }),

  markComplete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: true,
        },
      });
      return todo;
    }),

  markIncomplete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: false,
        },
      });
      return todo;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
      return todo;
    }),
});
