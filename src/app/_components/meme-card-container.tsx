"use client"

import { type FC, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Meme } from "@prisma/client"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { memeCommentSchema } from "@/lib/validations/meme"

import { MemeCard } from "./meme-card"
import { type User } from "next-auth"
import { api } from "@/trpc/react"

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
            await utils.memes.getMemeLikesCount.cancel({ memeId: meme.id })
            const prevLikesCount = utils.memes.getMemeLikesCount.getData({
                memeId: meme.id,
            })
            const prevIsLiked = utils.memes.isMemeLiked.getData({
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
            return { isLiked: prevIsLiked, likesCount: prevLikesCount }
        },
        onError: (_, __, ctx) => {
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
    const { mutate: comment } = api.memes.comment.useMutation()
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
