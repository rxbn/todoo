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
        tags: z
          .array(
            z.object({
              name: z.string(),
              id: z.string().optional(),
              userId: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.create({
        data: {
          userId: ctx.session.user.id,
          content: input.content,
          dueDate: input.dueDate,
          tags: {
            connectOrCreate: input.tags?.map((tag) => ({
              where: {
                userId_name: {
                  userId: ctx.session.user.id,
                  name: tag.name,
                },
              },
              create: {
                name: tag.name,
                userId: ctx.session.user.id,
              },
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
        tags: z
          .array(
            z.object({
              name: z.string(),
              id: z.string().optional(),
              userId: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo
        .update({
          where: {
            id: input.id,
          },
          data: {
            content: input.content,
            dueDate: input.dueDate,
            tags: {
              connectOrCreate: input.tags?.map((tag) => ({
                where: {
                  userId_name: {
                    userId: ctx.session.user.id,
                    name: tag.name,
                  },
                },
                create: {
                  name: tag.name,
                  userId: ctx.session.user.id,
                },
              })),
            },
          },
          include: {
            tags: true,
          },
        })
        .then((todo) => {
          return ctx.prisma.todo.update({
            where: {
              id: todo.id,
            },
            data: {
              tags: {
                disconnect: todo.tags.filter(
                  (tag) =>
                    !input.tags?.find((inputTag) => inputTag.name === tag.name)
                ),
              },
            },
            include: {
              tags: true,
            },
          });
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
