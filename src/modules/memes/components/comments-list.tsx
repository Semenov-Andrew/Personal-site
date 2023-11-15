import { Spinner } from "@/components/ui/spinner"
import { type CommentsPages } from "../types/comments-pages"
import { Comment } from "./comment"

interface CommentsListProps {
    isFetchingPreviousPage: boolean
    hasPreviousPage: boolean | undefined
    isFetchingNextPage: boolean
    hasNextPage: boolean | undefined
    isLoading: boolean
    handleFetchPreviousPage: () => Promise<void>
    handleFetchNextPage: () => Promise<void>
    commentsPages: CommentsPages | undefined
}

export const CommentsList = ({
    isFetchingPreviousPage,
    hasPreviousPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    handleFetchPreviousPage,
    handleFetchNextPage,
    commentsPages,
}: CommentsListProps) => {
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
                    {commentsPages?.pages.map((page) =>
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
