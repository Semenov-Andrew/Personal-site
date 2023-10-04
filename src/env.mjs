import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        KINDE_CLIENT_ID: z.string().min(1),
        KINDE_CLIENT_SECRET: z.string().min(1),
        KINDE_ISSUER_URL: z.string().url(),
        KINDE_SITE_URL: z.string().url(),
        KINDE_POST_LOGOUT_REDIRECT_URL: z.string().url(),
        KINDE_POST_LOGIN_REDIRECT_URL: z.string().url(),
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.enum(["development", "test", "production"]),
        CLERK_SECRET_KEY: z.string(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_APP_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID,
        KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET,
        KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL,
        KINDE_SITE_URL: process.env.KINDE_SITE_URL,
        KINDE_POST_LOGOUT_REDIRECT_URL:
            process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
        KINDE_POST_LOGIN_REDIRECT_URL:
            process.env.KINDE_POST_LOGIN_REDIRECT_URL,

        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
     * This is especially useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
