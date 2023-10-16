import { z } from "zod"

export const memeCommentSchema = z.object({
    text: z.string().min(10, { message: "Min comment length is 10 letters" }),
})
