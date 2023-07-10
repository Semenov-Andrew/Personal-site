import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";


export const postRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ctx}) => {
        return await ctx.prisma.post.findMany({
            take: 100,
            orderBy: [{createdAt: "desc"}]
        })
    }),
})