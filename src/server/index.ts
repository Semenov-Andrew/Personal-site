import { memesRouter } from "./routers/memes"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    memes: memesRouter,
})

export type AppRouter = typeof appRouter
