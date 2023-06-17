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
        include: {
          tags: true,
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
      const tags = await Promise.all(
        (input.tags || []).map(async (tagName) => {
          let tag = await ctx.prisma.tag.findUnique({
            where: {
              userId_name: { userId: ctx.session.user.id, name: tagName },
            },
          });
          if (!tag) {
            tag = await ctx.prisma.tag.create({
              data: {
                name: tagName,
                userId: ctx.session.user.id,
              },
            });
          }
          return tag;
        })
      );

      const todo = await ctx.prisma.todo.create({
        data: {
          userId: ctx.session.user.id,
          content: input.content,
          dueDate: input.dueDate,
          tags: {
            connect: tags.map((tag) => ({ id: tag.id })),
          },
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
      const tags = await Promise.all(
        (input.tags || []).map(async (tagName) => {
          let tag = await ctx.prisma.tag.findUnique({
            where: {
              userId_name: { userId: ctx.session.user.id, name: tagName },
            },
          });
          if (!tag) {
            tag = await ctx.prisma.tag.create({
              data: {
                name: tagName,
                userId: ctx.session.user.id,
              },
            });
          }
          return tag;
        })
      );

      const currentTodo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
        include: { tags: true },
      });

      if (!currentTodo) throw new Error("Todo not found");

      const disconnectIds = currentTodo.tags
        .map((tag) => tag.id)
        .filter((id) => !tags.some((tag) => tag.id === id));

      const todo = await ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
          dueDate: input.dueDate,
          tags: {
            connect: tags.map((tag) => ({ id: tag.id })),
            disconnect: disconnectIds.map((id) => ({ id })),
          },
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
