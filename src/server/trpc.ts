import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import {
    inferRouterInputs,
    inferRouterOutputs,
    initTRPC,
    TRPCError,
} from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import { AppRouter } from "."

const t = initTRPC.create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        }
    },
})
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
    const { getUser } = getKindeServerSession()
    const user = getUser()
    if (!user || !user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return opts.next({
        ctx: {
            userId: user.id,
            user,
        },
    })
})

export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
export const createTRPCRouter = t.router

export type RouterInputs = inferRouterInputs<AppRouter>

export type RouterOutputs = inferRouterOutputs<AppRouter>
