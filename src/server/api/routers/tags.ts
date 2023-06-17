import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
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
