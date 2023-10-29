import Image from "next/image"

import { Spinner } from "@/components/ui/spinner"
import { api } from "@/trpc/react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Comment } from "./comment"

dayjs.extend(relativeTime)
dayjs.locale("ru")

export const Comments = ({ memeId }: { memeId: string }) => {
    const { data: comments, isLoading } = api.memes.getComments.useQuery({
        memeId,
    })
    if (isLoading)
        return (
            <div className="flex justify-center py-3">
                <Spinner />
            </div>
        )
    if (!comments) return <div>Unable to get comments</div>
    if (!comments.length) return null
    return (
        <div className="space-y-4 py-4">
            {comments.map((comment) => (
                <Comment comment={comment} />
            ))}
        </div>
    )
}
