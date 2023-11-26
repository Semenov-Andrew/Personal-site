import { type MemeComment } from "@prisma/client"
import { type InfiniteData } from "@tanstack/react-query"

export type CommentsPages = InfiniteData<{
    comments: MemeComment[]
    nextCursor: string | undefined
    prevCursor: string | undefined
}>
