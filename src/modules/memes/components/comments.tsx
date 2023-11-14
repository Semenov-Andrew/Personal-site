import { Spinner } from "@/components/ui/spinner"
import { api } from "@/trpc/react"
import { Comment } from "./comment"
// import { useState } from "react"

export const Comments = ({
    memeId,
    isCommentSent,
}: {
    memeId: string
    isCommentSent: boolean
}) => {
    // const [_, setPage] = useState(0)

    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isFetchingPreviousPage,
        hasPreviousPage,
        isLoading,
        fetchPreviousPage,
    } = api.memes.getInfiniteComments.useInfiniteQuery(
        {
            memeId,
            isFromLastPage: isCommentSent,
        },
        {
            cacheTime: 0,
            staleTime: 600000, // 10 minutes
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            getPreviousPageParam: (firstPage) => firstPage.prevCursor,
        }
    )

    const handleFetchNextPage = async () => {
        await fetchNextPage()
        // setPage((prev) => prev + 1)
    }

    const handleFetchPreviousPage = async () => {
        await fetchPreviousPage()
        // setPage((prev) => prev - 1)
    }

    return (
        <div>
            <div className="mb-4">
                {isFetchingPreviousPage ? (
                    <div className="flex justify-center">
                        <Spinner />
                    </div>
                ) : (
                    hasPreviousPage && (
                        <button
                            className="text-sm"
                            onClick={handleFetchPreviousPage}
                        >
                            Show more comments
                        </button>
                    )
                )}
            </div>
            {isLoading ? (
                <div className="flex justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="space-y-4">
                    {data?.pages.map((page) =>
                        page.comments.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))
                    )}
                </div>
            )}

            <div className="my-2">
                {isFetchingNextPage ? (
                    <div className="flex justify-center">
                        <Spinner />
                    </div>
                ) : (
                    hasNextPage && (
                        <button
                            className="py-2 text-sm"
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
