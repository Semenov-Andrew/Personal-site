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
    createMeme: privateProcedure
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
})
