import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
