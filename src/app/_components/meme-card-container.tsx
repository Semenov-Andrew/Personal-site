"use client"

import { type FC, useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { MemeComment, type Meme } from "@prisma/client"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { memeCommentSchema } from "@/lib/validations/meme"

import { MemeCard } from "./meme-card"
import { type User } from "next-auth"
import { api } from "@/trpc/react"
import { useToast } from "./ui/use-toast"

interface MemeCardContainerProps {
    isAuthenticated: boolean
    user: User | undefined
    meme: Meme
}

export const MemeCardContainer: FC<MemeCardContainerProps> = ({
    meme,
    isAuthenticated,
    user,
}) => {
    const { toast } = useToast()
    const { data: comments } = api.memes.getComments.useQuery({
        memeId: meme.id,
    })
    const [isActiveComments, setIsActiveComments] = useState(false)
    const { data: isLiked } = api.memes.isMemeLiked.useQuery(
        {
            memeId: meme.id,
        },
        { enabled: isAuthenticated }
    )
    const { data: likesCount } = api.memes.getMemeLikesCount.useQuery(
        { memeId: meme.id },
        { initialData: meme.likesCount }
    )
    const utils = api.useContext()
    const { mutate: toggleLike } = api.memes.toggleLike.useMutation({
        // optimistic likesCount & isLiked update
        onMutate: async () => {
            await utils.memes.isMemeLiked.cancel({ memeId: meme.id })
            await utils.memes.getMemeLikesCount.cancel({
                memeId: meme.id,
            })

            utils.memes.getMemeLikesCount.setData(
                { memeId: meme.id },
                (oldQueryData: number | undefined) =>
                    (oldQueryData ?? 0) + (isLiked ? -1 : 1)
            )
            utils.memes.isMemeLiked.setData(
                { memeId: meme.id },
                (oldQueryData: boolean | undefined) => !oldQueryData
            )
            const prevLikesCount = utils.memes.getMemeLikesCount.getData({
                memeId: meme.id,
            })
            const prevIsLiked = utils.memes.isMemeLiked.getData({
                memeId: meme.id,
            })
            return { isLiked: prevIsLiked, likesCount: prevLikesCount }
        },
        onError: ({ data, message }, __, ctx) => {
            if (data?.code === "TOO_MANY_REQUESTS")
                toast({
                    title: "You reach rate limit",
                    description: message,
                })
            utils.memes.isMemeLiked.setData(
                { memeId: meme.id },
                ctx?.isLiked ?? false
            )
            utils.memes.getMemeLikesCount.setData(
                { memeId: meme.id },
                ctx?.likesCount ?? 0
            )
        },
    })
    const { mutate: comment } = api.memes.comment.useMutation({
        // optimistic comment sending
        onMutate: async ({ text, memeId }) => {
            await utils.memes.getComments.cancel({ memeId: meme.id })
            const prevComments = utils.memes.getComments.getData({
                memeId: meme.id,
            })
            const optimisticComment: MemeComment = {
                id: Math.random().toString(),
                commentatorId: user?.id || Math.random().toString(),
                commentatorName: user?.name || "",
                image: user?.image || "",
                memeId,
                createdAt: new Date(),
                text: text,
            }
            utils.memes.getComments.setData(
                { memeId: meme.id },
                (oldQueryData) => [...(oldQueryData ?? []), optimisticComment]
            )
            return { comments: prevComments }
        },
        onError: (_, __, ctx) => {
            utils.memes.getComments.setData(
                { memeId: meme.id },
                ctx?.comments ?? []
            )
        },
    })
    const commentForm = useForm<z.infer<typeof memeCommentSchema>>({
        resolver: zodResolver(memeCommentSchema),
        defaultValues: {
            text: "",
        },
    })

    const onCommentSubmit = (values: z.infer<typeof memeCommentSchema>) => {
        comment({
            memeId: meme.id,
            text: values.text,
        })
        commentForm.reset()
    }
    return (
        <MemeCard
            meme={meme}
            isLiked={isLiked}
            toggleLike={toggleLike}
            likesCount={likesCount}
            isAuthenticated={isAuthenticated}
            isActiveComments={isActiveComments}
            setIsActiveComments={setIsActiveComments}
            commentForm={commentForm}
            onCommentSubmit={onCommentSubmit}
            image={user?.image}
            comments={comments}
        />
    )
}
