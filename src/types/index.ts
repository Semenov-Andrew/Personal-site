import { z } from "zod"

import { userPrivateMetadataSchema } from "@/lib/validations/auth"

export type UserRole = z.infer<typeof userPrivateMetadataSchema.shape.role>
