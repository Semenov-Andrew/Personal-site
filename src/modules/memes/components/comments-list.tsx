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
        <div className="py-4">
            {hasPreviousPage && (
                <button
                    className="mb-4 flex items-center space-x-2 text-sm disabled:cursor-not-allowed disabled:text-muted-foreground"
                    onClick={handleFetchPreviousPage}
                    disabled={isFetchingPreviousPage}
                >
                    <span>Show previous comments</span>
                    {isFetchingPreviousPage && <Spinner size={"sm"} />}
                </button>
            )}
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

            {hasNextPage && (
                <button
                    className="mt-4 flex items-center space-x-2 text-sm disabled:cursor-not-allowed disabled:text-muted-foreground"
                    onClick={handleFetchNextPage}
                    disabled={isFetchingNextPage}
                >
                    <span>Show more comments</span>
                    {isFetchingNextPage && <Spinner size={"sm"} />}
                </button>
            )}
        </div>
    )
}
