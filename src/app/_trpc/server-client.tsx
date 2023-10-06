import { appRouter } from "@/server"
import { httpBatchLink } from "@trpc/client"

import { absoluteUrl } from "@/lib/utils"

export const serverClient = appRouter.createCaller({
    links: [
        httpBatchLink({
            url: absoluteUrl("/api/trpc"),
        }),
    ],
})
