import { z } from "zod"

export const memeCommentSchema = z.object({
    text: z.string().max(500, { message: "Max comment length is 500 symbols" }),
})
