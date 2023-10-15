import { authRouter } from "./routers/auth"
import { memesRouter } from "./routers/memes"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    memes: memesRouter,
    auth: authRouter,
})

export type AppRouter = typeof appRouter
