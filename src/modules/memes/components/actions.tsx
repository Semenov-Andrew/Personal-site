import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import { type FC } from "react"
import { LoginRequiredDialog } from "./login-required-dialog"

interface ActionsProps {
    isAuthenticated: boolean
    memeId: string
    initialLikesCount: number
    setIsActiveComments: (isActiveComments: boolean) => void
    initialCommentsCount: number
}

export const Actions: FC<ActionsProps> = ({
    isAuthenticated,
    memeId,
    setIsActiveComments,
    initialCommentsCount,
    initialLikesCount,
}) => {
    const { toast } = useToast()
    const utils = api.useUtils()
    const { data: likesCount } = api.memes.getLikesCount.useQuery(
        { memeId },
        { initialData: initialLikesCount }
    )
    const { data: isLiked } = api.memes.isLiked.useQuery(
        {
            memeId: memeId,
        },
        { enabled: isAuthenticated }
    )
    const { data: commentsCount } = api.memes.getCommentsCount.useQuery(
        { memeId: memeId },
        { initialData: initialCommentsCount }
    )
    const { mutate: toggleLike } = api.memes.toggleLike.useMutation({
        // optimistic likesCount & isLiked update
        onMutate: async () => {
            await utils.memes.isLiked.cancel({ memeId })
            await utils.memes.getLikesCount.cancel({
                memeId,
            })

            utils.memes.getLikesCount.setData(
                { memeId },
                (oldQueryData: number | undefined) =>
                    (oldQueryData ?? 0) + (isLiked ? -1 : 1)
            )
            utils.memes.isLiked.setData(
                { memeId },
                (oldQueryData: boolean | undefined) => !oldQueryData
            )
            const prevLikesCount = utils.memes.getLikesCount.getData({
                memeId,
            })
            const prevIsLiked = utils.memes.isLiked.getData({
                memeId,
            })
            return { isLiked: prevIsLiked, likesCount: prevLikesCount }
        },
        onError: ({ data, message }, __, ctx) => {
            if (data?.code === "TOO_MANY_REQUESTS")
                toast({
                    title: "You reach rate limit",
                    description: message,
                })
            utils.memes.isLiked.setData({ memeId }, ctx?.isLiked ?? false)
            utils.memes.getLikesCount.setData({ memeId }, ctx?.likesCount ?? 0)
        },
    })
    return (
        <div className="flex space-x-2 md:space-x-3">
            {isAuthenticated ? (
                <Button
                    className="flex items-center space-x-2 rounded-full"
                    size={"sm"}
                    variant={isLiked ? "default" : "secondary"}
                    onClick={() => toggleLike({ memeId })}
                >
                    <HeartIcon className="h-6 w-6" />
                    <span>{likesCount}</span>
                </Button>
            ) : (
                <LoginRequiredDialog
                    triggerBtn={
                        <Button
                            className="flex items-center space-x-2 rounded-full"
                            size={"sm"}
                            variant={"secondary"}
                        >
                            <HeartIcon className="h-6 w-6" />
                            <span>{likesCount}</span>
                        </Button>
                    }
                />
            )}

            <Button
                className="flex items-center space-x-2 rounded-full"
                size={"sm"}
                variant={"secondary"}
                onClick={() => setIsActiveComments(true)}
            >
                <ChatBubbleOvalLeftIcon className="h-6 w-6" />
                <span>{commentsCount}</span>
            </Button>
        </div>
    )
}
