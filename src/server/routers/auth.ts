import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { TRPCError } from "@trpc/server"

import { prisma } from "@/lib/db"

import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc"

export const authRouter = createTRPCRouter({
    callback: privateProcedure.query(async ({ ctx }) => {
        const { user } = ctx

        if (!user.id || !user.email)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "missed id or email",
            })

        // check if the user is in the database
        const dbUser = await prisma.user.findFirst({
            where: {
                id: user.id,
            },
        })

        if (!dbUser) {
            // create user in db
            await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                },
            })
        }

        return { success: true }
    }),
    getKindeSession: publicProcedure.query(async () => {
        const {
            getUser,
            isAuthenticated: getIsAuthenticated,
            getPermissions,
            getOrganization,
        } = getKindeServerSession()
        const user = getUser()
        const isAuthenticated = getIsAuthenticated()
        const permissions = getPermissions()
        const organization = getOrganization()
        return { user, isAuthenticated, permissions, organization }
    }),
})
