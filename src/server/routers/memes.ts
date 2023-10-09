import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { prisma } from "@/lib/db"
import { PERMISSIONS } from "@/lib/permissions"

import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"

export const memesRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
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
        .mutation(async ({ ctx, input }) => {
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
                const existingLike = await prisma.memeLike.findUnique({
                    where: {
                        userId_memeId: {
                            userId,
                            memeId,
                        },
                    },
                })
                if (existingLike) {
                    await prisma.memeLike.delete({
                        where: {
                            userId_memeId: {
                                memeId,
                                userId,
                            },
                        },
                    })
                    const meme = await prisma.meme.update({
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
                    await prisma.memeLike.create({
                        data: {
                            userId,
                            memeId,
                        },
                    })
                    const meme = await prisma.meme.update({
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
            } catch (e) {
                console.error(e)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An error occurred while toggling like",
                })
            }
        }),
    isMemeLiked: privateProcedure
        .input(z.object({ memeId: z.string() }))
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
})
