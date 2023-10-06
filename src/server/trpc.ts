import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { initTRPC, TRPCError } from "@trpc/server"

// import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"

const t = initTRPC.create()
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

// export const createTRPCContext = ({
//     req,
//     resHeaders,
// }: FetchCreateContextFnOptions) => {}

export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
export const createTRPCRouter = t.router
