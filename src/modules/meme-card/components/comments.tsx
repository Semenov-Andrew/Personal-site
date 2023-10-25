import Image from "next/image"

import { Spinner } from "@/components/ui/spinner"
import { api } from "@/trpc/react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

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
                <div className="flex" key={comment.id}>
                    <div className="flex space-x-2">
                        <div className="shrink-0">
                            <Image
                                className="rounded-full"
                                src={comment.image}
                                width={40}
                                height={40}
                                alt={`${comment.commentatorName} image`}
                            />
                        </div>
                        <div className="text-sm">
                            <div className="mb-1 font-semibold">
                                {comment.commentatorName}
                            </div>
                            <div>{comment.text}</div>
                            <div className=" mt-1 text-muted-foreground">
                                {dayjs(comment.createdAt).fromNow()}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
