import { prisma } from "@/lib/db"

import { publicProcedure, router } from "./trpc"

export const appRouter = router({
    getTodos: publicProcedure.query(async () => {
        return await prisma.meme.findMany()
    }),
})

export type AppRouter = typeof appRouter
