import { Spinner } from "@/components/ui/spinner"
import { api } from "@/trpc/react"
import { Comment } from "./comment"
import { useState } from "react"
import { COMMENTS_REQ_LIMIT } from "../constants/commentsReqLimit"

export const Comments = ({ memeId }: { memeId: string }) => {
    const [page, setPage] = useState(0)

    const { data, fetchNextPage, isFetchingNextPage } =
        api.memes.getInfiniteComments.useInfiniteQuery(
            {
                limit: COMMENTS_REQ_LIMIT,
                memeId,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        )

    const handleFetchNextPage = () => {
        fetchNextPage()
        setPage((prev) => prev + 1)
    }

    const handleFetchPreviousPage = () => {
        setPage((prev) => prev - 1)
    }

    const isHasMoreComments = !!data?.pages[page]?.nextCursor

    return (
        <div>
            <div className="space-y-4 py-4">
                {data?.pages.map((page) =>
                    page.comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} />
                    ))
                )}
            </div>
            <div className="mb-4">
                {isFetchingNextPage ? (
                    <div className="flex justify-center">
                        <Spinner />
                    </div>
                ) : (
                    isHasMoreComments && (
                        <button
                            className="text-sm"
                            onClick={handleFetchNextPage}
                        >
                            Show more comments
                        </button>
                    )
                )}
            </div>
        </div>
    )
}
