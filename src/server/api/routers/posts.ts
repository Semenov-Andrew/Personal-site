import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {clerkClient} from "@clerk/nextjs";
import {filterUserForClient} from "~/server/helpers/filterUserForClient";
import {TRPCError} from "@trpc/server";


export const postRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ctx}) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: [{createdAt: "desc"}]
        })

        const users = (
            await clerkClient.users.getUserList({
                userId: posts.map(post => post.authorId),
                limit: 100
            })
        ).map(filterUserForClient)

        return posts.map(post => {
            const author = users.find(user => user.id === post.authorId)
            if (!author) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Author was not found"
                })
            }
            return {
                post,
                author
            }
        })
    })
})