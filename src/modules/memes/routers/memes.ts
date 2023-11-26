import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { COMMENTS_REQ_LIMIT } from "../constants/commentsReqLimit"
import { getServerAuthSession } from "@/server/auth"

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(15, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
})

export const memesRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        try {
            const memes = await ctx.db.meme.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            })
            return memes
        } catch (e) {
            console.error(e)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Memes were not found",
            })
        }
    }),
    create: protectedProcedure
        .input(
            z.object({
                imageSrc: z.string().min(1),
                title: z.string().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const session = await getServerAuthSession()
            if (session?.user.role !== "admin")
                return new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only admin accessible",
                })
            const { imageSrc, title } = input
            try {
                const newMeme = await ctx.db.meme.create({
                    data: {
                        imageSrc,
                        title,
                    },
                })
                return newMeme
            } catch (e) {
                console.error(e)
                return new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error creating meme",
                })
            }
        }),
    toggleLike: protectedProcedure
        .input(
            z.object({
                memeId: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { session } = ctx
            const { memeId } = input

            const { success } = await ratelimit.limit(session.user.id)

            if (!success)
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                })

            try {
                return await ctx.db.$transaction(
                    async (tx) => {
                        // Check if the user has already liked the meme
                        const existingLike = await tx.memeLike.findUnique({
                            where: {
                                userId_memeId: {
                                    userId: session?.user.id,
                                    memeId,
                                },
                            },
                        })

                        if (existingLike) {
                            // If the user already liked the meme, remove the like
                            const memeLike = await tx.memeLike.delete({
                                where: {
                                    userId_memeId: {
                                        memeId,
                                        userId: session?.user.id,
                                    },
                                },
                            })

                            // Update the likesCount for the meme (decrement)
                            if (memeLike) {
                                const meme = await tx.meme.update({
                                    where: {
                                        id: memeId,
                                    },
                                    data: {
                                        likesCount: {
                                            decrement: 1,
                                        },
                                    },
                                })

                                return {
                                    status: "success",
                                    message: "like removed",
                                    likesCount: meme.likesCount,
                                }
                            } else {
                                throw new TRPCError({
                                    code: "INTERNAL_SERVER_ERROR",
                                    message: "unable to remove like",
                                })
                            }
                        } else {
                            // If the user hasn't liked the meme, add a new like
                            await tx.memeLike.create({
                                data: {
                                    userId: session?.user.id,
                                    memeId,
                                },
                            })

                            // Update the likesCount for the meme (increment)
                            const meme = await tx.meme.update({
                                where: {
                                    id: memeId,
                                },
                                data: {
                                    likesCount: {
                                        increment: 1,
                                    },
                                },
                            })

                            return {
                                status: "success",
                                message: "like added",
                                likesCount: meme.likesCount,
                            }
                        }
                    },
                    { isolationLevel: "Serializable" }
                )
            } catch (e) {
                console.error(e)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An error occurred while toggling like",
                })
            }
        }),

    isLiked: protectedProcedure
        .input(z.object({ memeId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const { session } = ctx
            const { memeId } = input
            try {
                const like = await ctx.db.memeLike.findFirst({
                    where: {
                        userId: session.user.id,
                        memeId,
                    },
                })
                return !!like
            } catch (e) {
                console.error(e)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An error occurred while getting like status",
                })
            }
        }),
    getLikesCount: publicProcedure
        .input(z.object({ memeId: z.string().min(1) }))
        .query(async ({ input, ctx }) => {
            const { memeId } = input
            try {
                const meme = await ctx.db.meme.findFirst({
                    where: {
                        id: memeId,
                    },
                })
                if (!meme)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "meme not found",
                    })
                return meme.likesCount
            } catch (e) {
                console.error(e)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An error occurred while getting likes count",
                })
            }
        }),
    getCommentsCount: publicProcedure
        .input(z.object({ memeId: z.string().min(1) }))
        .query(async ({ input, ctx }) => {
            const { memeId } = input
            try {
                const meme = await ctx.db.meme.findFirst({
                    where: {
                        id: memeId,
                    },
                })
                if (!meme)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "meme not found",
                    })
                return meme.commentsCount
            } catch (e) {
                console.error(e)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An error occurred while getting comments count",
                })
            }
        }),
    comment: protectedProcedure
        .input(
            z.object({
                memeId: z.string().min(1),
                text: z.string().max(500),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { memeId, text } = input
            const { session } = ctx
            const { success } = await ratelimit.limit(session.user.id)

            if (!success)
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                })

            const { user } = session
            if (!user.name) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Unable to get commentator name",
                })
            }
            if (!user.image) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Unable to get image of commentator",
                })
            }
            try {
                console.log(user)
                const comment = await ctx.db.memeComment.create({
                    data: {
                        text,
                        memeId,
                        commentatorId: user.id,
                        commentatorName: user.name,
                        image: user.image,
                    },
                })
                if (!comment) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Unable to create comment",
                    })
                }
                await ctx.db.meme.update({
                    where: {
                        id: memeId,
                    },
                    data: {
                        commentsCount: {
                            increment: 1,
                        },
                    },
                })
                return { success: true }
            } catch (e) {
                console.error(e)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Unable to create comment",
                })
            }
        }),
    getComments: publicProcedure
        .input(z.object({ memeId: z.string().min(1) }))
        .query(async ({ input, ctx }) => {
            const { memeId } = input
            try {
                const comments = await ctx.db.memeComment.findMany({
                    where: {
                        memeId,
                    },
                })
                if (!comments) {
                    return []
                }
                return comments
            } catch (e) {
                console.error(e)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Unable to get comments",
                })
            }
        }),
    getInfiniteComments: publicProcedure
        .input(
            z.object({
                limit: z.number().default(COMMENTS_REQ_LIMIT),
                cursor: z.string().nullish(),
                skip: z.number().optional(),
                memeId: z.string().min(1),
                order: z.enum(["asc", "desc"]).default("asc"),
                isFromLastPage: z.boolean().default(false),
            })
        )
        .query(async ({ ctx, input }) => {
            const { limit, skip, memeId, cursor, isFromLastPage } = input
            if (isFromLastPage) {
                const comments = await ctx.db.memeComment.findMany({
                    where: {
                        memeId,
                    },
                    take: limit + 1,
                    cursor: cursor ? { id: cursor } : undefined,
                    orderBy: {
                        id: "desc",
                    },
                })
                let prevCursor: typeof cursor | undefined = undefined
                if (comments.length > limit) {
                    const prevItem = comments.pop()
                    prevCursor = prevItem?.id
                }
                return {
                    comments: comments.reverse(),
                    nextCursor: undefined,
                    prevCursor,
                }
            }
            const comments = await ctx.db.memeComment.findMany({
                take: limit + 1,
                skip,
                cursor: cursor ? { id: cursor } : undefined,
                where: {
                    memeId,
                },
            })
            let nextCursor: typeof cursor | undefined = undefined
            if (comments.length > limit) {
                const nextItem = comments.pop()
                nextCursor = nextItem?.id
            }
            return {
                comments,
                nextCursor,
                prevCursor: undefined,
            }
        }),
})
