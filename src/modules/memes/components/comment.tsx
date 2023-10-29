import { MemeComment } from "@prisma/client"
import Image from "next/image"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
dayjs.locale("ru")

export const Comment = ({ comment }: { comment: MemeComment }) => {
    return (
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
    )
}
