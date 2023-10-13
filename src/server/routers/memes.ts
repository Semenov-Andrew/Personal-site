import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { prisma } from "@/lib/db"
import { PERMISSIONS } from "@/lib/permissions"

import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"

export const memesRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        try {
            const memes = await prisma.meme.findMany({
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
    create: privateProcedure
        .input(
            z.object({
                imageSrc: z.string().min(1),
                title: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            const { getPermission } = getKindeServerSession()
            if (!getPermission(PERMISSIONS.dashboardAccess).isGranted)
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only admin accessible",
                })

            const { imageSrc, title } = input
            try {
                const newMeme = await prisma.meme.create({
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
    toggleLike: privateProcedure
        .input(
            z.object({
                memeId: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx
            const { memeId } = input

            try {
                return await prisma.$transaction(
                    async (tx) => {
                        // Check if the user has already liked the meme
                        const existingLike = await tx.memeLike.findUnique({
                            where: {
                                userId_memeId: {
                                    userId,
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
                                        userId,
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
                                    userId,
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

    isMemeLiked: privateProcedure
        .input(z.object({ memeId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const { userId } = ctx
            const { memeId } = input
            try {
                const like = await prisma.memeLike.findUnique({
                    where: {
                        userId_memeId: {
                            userId,
                            memeId,
                        },
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
    getMemeLikesCount: publicProcedure
        .input(z.object({ memeId: z.string().min(1) }))
        .query(async ({ input }) => {
            const { memeId } = input
            try {
                const meme = await prisma.meme.findUnique({
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
})
