import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ done: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const todos = await ctx.prisma.todo.findMany({
        where: {
          userId: ctx.session.user.id,
          done: input.done,
        },
      });
      return todos;
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        dueDate: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.create({
        data: {
          userId: ctx.session.user.id,
          content: input.content,
          dueDate: input.dueDate,
          tags: {
            connect: input.tags?.map((tag) => ({
              id: tag,
            })),
          },
        },
        include: {
          tags: true,
        },
      });

      return todo;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
        dueDate: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
          dueDate: input.dueDate,
          tags: {
            set: input.tags?.map((tag) => ({
              id: tag,
            })),
          },
        },
        include: {
          tags: true,
        },
      });

      return todo;
    }),

  toggleDone: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: input.done,
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
