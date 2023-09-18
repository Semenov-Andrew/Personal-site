import { z } from "zod"

export const userPrivateMetadataSchema = z.object({
    role: z.enum(["user", "admin"]),
})
