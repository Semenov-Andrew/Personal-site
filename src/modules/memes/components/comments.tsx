import { api } from "@/trpc/react"
import { CommentsList } from "./comments-list"
import { CommentsForm } from "./comments-form"
import { type User } from "next-auth"

export const Comments = ({
    memeId,
    isCommentSent,
    isAuthenticated,
    currentUser,
    setIsCommentSent,
}: {
    memeId: string
    isCommentSent: boolean
    isAuthenticated: boolean
    currentUser: User | undefined
    setIsCommentSent: (isCommentSent: boolean) => void
}) => {
    const {
        data: commentsPages,
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
    }

    const handleFetchPreviousPage = async () => {
        await fetchPreviousPage()
    }

    return (
        <div className="mx-2 border-t lg:mx-4">
            <CommentsList
                isFetchingPreviousPage={isFetchingPreviousPage}
                hasPreviousPage={hasPreviousPage}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                isLoading={isLoading}
                handleFetchPreviousPage={handleFetchPreviousPage}
                handleFetchNextPage={handleFetchNextPage}
                commentsPages={commentsPages}
            />
            <CommentsForm
                isAuthenticated={isAuthenticated}
                setIsCommentSent={setIsCommentSent}
                currentUser={currentUser}
                memeId={memeId}
            />
        </div>
    )
}
