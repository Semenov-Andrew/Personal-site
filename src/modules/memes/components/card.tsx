"use client"

import { type FC, useState } from "react"
import { type Meme } from "@prisma/client"
import dayjs from "dayjs"
import { type User } from "next-auth"
import { Actions } from "./actions"
import { Comments } from "./comments"
import { CommentsForm } from "./comments-form"
import { MemeImage } from "./image"

interface CardProps {
    isAuthenticated: boolean
    user: User | undefined
    meme: Meme
}

export const Card: FC<CardProps> = ({ meme, isAuthenticated, user }) => {
    const [isActiveComments, setIsActiveComments] = useState(false)
    return (
        <div className="ml-[calc(50%-50vw)] flex w-screen flex-col overflow-hidden sm:ml-0 sm:w-full ">
            <MemeImage imageSrc={meme.imageSrc} />
            <div className="flex flex-col space-y-3 p-2 text-sm sm:flex-row-reverse sm:justify-between sm:space-y-0 lg:px-4 lg:py-2">
                <div className="flex items-center space-x-1 text-muted-foreground">
                    <span>{meme.viewsCount} views</span>
                    <span>•</span>
                    <div className="">{dayjs(meme.createdAt).fromNow()}</div>
                </div>
                <Actions
                    {...{
                        isAuthenticated,
                        initialCommentsCount: meme.commentsCount,
                        setIsActiveComments,
                        memeId: meme.id,
                        initialLikesCount: meme.likesCount,
                    }}
                />
            </div>
            {isActiveComments ? (
                <div className="mx-2 mt-2 border-t py-4 sm:mx-4">
                    <Comments memeId={meme.id} />
                    <CommentsForm
                        isAuthenticated={isAuthenticated}
                        currentUser={user}
                        memeId={meme.id}
                    />
                </div>
            ) : null}
        </div>
    )
}
