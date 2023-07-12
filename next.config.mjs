/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { withContentlayer } from "next-contentlayer"

import "./env.mjs"

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    images: {
        domains: ["images.clerk.dev"],
    },
}

export default withContentlayer(config)
