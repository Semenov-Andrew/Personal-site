"use client"

import { useEffect, useState, type FC } from "react"
import Image from "next/image"
import { RouterOutputs } from "@/server/trpc"
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import { type Meme } from "@prisma/client"
import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { getQueryKey } from "@trpc/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { trpc } from "@/app/_trpc/client"

import { Button } from "./ui/button"

dayjs.extend(relativeTime)
dayjs.locale("ru")

interface MemeCardProps {
    meme: Meme
}

export const MemeCard: FC<MemeCardProps> = ({ meme }) => {
    const utils = trpc.useContext()
    const { data: isLiked } = trpc.memes.isMemeLiked.useQuery({
        memeId: meme.id,
    })
    const { mutate: toggleLike } = trpc.memes.toggleLike.useMutation({
        onMutate: async () => {
            await utils.memes.getAll.cancel()
            const prevIsMemeLiked = utils.memes.isMemeLiked.getData()
            utils.memes.isMemeLiked.setData(
                { memeId: meme.id },
                (oldQueryData: boolean | undefined) => !oldQueryData
            )
            return prevIsMemeLiked
        },
        onError: (_, __, ctx) => {
            utils.memes.isMemeLiked.setData({ memeId: meme.id }, ctx ?? false)
        },
        onSettled: () => {
            void utils.memes.isMemeLiked.invalidate()
        },
    })
    return (
        <div className="ml-[calc(50%-50vw)] flex w-screen flex-col overflow-hidden sm:ml-0 sm:w-full ">
            <div className="flex flex-1 items-center justify-center bg-muted sm:rounded-lg lg:px-4 lg:py-2">
                <div className="relative min-h-[420px] flex-1">
                    <Image
                        src={meme.imageSrc}
                        fill
                        alt="meme"
                        className="w-full"
                        style={{ objectFit: "contain" }}
                    />
                </div>
            </div>
            <div className="flex flex-col space-y-3 p-2 text-sm sm:flex-row-reverse sm:justify-between sm:space-y-0 lg:px-4 lg:py-2">
                <div className="flex items-center space-x-1 text-muted-foreground">
                    <span>{meme.viewsCount} views</span>
                    <span>•</span>
                    <div className="">{dayjs(meme.createdAt).fromNow()}</div>
                </div>
                <div className="flex space-x-2 md:space-x-3">
                    <Button
                        className="flex items-center space-x-2 rounded-full"
                        size={"sm"}
                        variant={isLiked ? "default" : "secondary"}
                        onClick={() => toggleLike({ memeId: meme.id })}
                    >
                        <HeartIcon className="h-6 w-6" />
                        <span>{meme.likesCount}</span>
                    </Button>
                    <Button
                        className="flex items-center space-x-2 rounded-full"
                        size={"sm"}
                        variant={"secondary"}
                    >
                        <ChatBubbleOvalLeftIcon className="h-6 w-6" />
                        <span>{meme.commentsCount}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
