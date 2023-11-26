import { z } from "zod"

const UserRole = z.enum(["admin", "user"])

export type UserRole = z.infer<typeof UserRole>
