"use client"

import { type FC } from "react"
import Image from "next/image"
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server"
import { type Meme } from "@prisma/client"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { trpc } from "@/app/_trpc/client"

import { Header } from "./header"
import { LoginButton } from "./login-button"
import { Button, buttonVariants } from "./ui/button"

dayjs.extend(relativeTime)
dayjs.locale("ru")

interface MemeCardProps {
    meme: Meme
}

export const MemeCard: FC<MemeCardProps> = ({ meme }) => {
    const { data: session } = trpc.auth.getKindeSession.useQuery()
    const { data: isLiked } = trpc.memes.isMemeLiked.useQuery(
        {
            memeId: meme.id,
        },
        { enabled: session?.isAuthenticated }
    )
    const { data: likesCount } = trpc.memes.getMemeLikesCount.useQuery(
        { memeId: meme.id },
        { initialData: meme.likesCount }
    )
    const utils = trpc.useContext()
    const { mutate: toggleLike } = trpc.memes.toggleLike.useMutation({
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
                    {session?.user ? (
                        <Button
                            className="flex items-center space-x-2 rounded-full"
                            size={"sm"}
                            variant={isLiked ? "default" : "secondary"}
                            onClick={() => toggleLike({ memeId: meme.id })}
                        >
                            <HeartIcon className="h-6 w-6" />
                            <span>{likesCount}</span>
                        </Button>
                    ) : (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    className="flex items-center space-x-2 rounded-full"
                                    size={"sm"}
                                    variant={"secondary"}
                                >
                                    <HeartIcon className="h-6 w-6" />
                                    <span>{likesCount}</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Oh, you want to like
                                    </DialogTitle>
                                    <DialogDescription>
                                        Login required. It will take less than
                                        10 seconds
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 flex space-x-4">
                                    <LoginLink
                                        className={cn(
                                            buttonVariants(),
                                            "w-full"
                                        )}
                                    >
                                        Sign-in
                                    </LoginLink>
                                    <RegisterLink
                                        className={cn(
                                            buttonVariants({
                                                variant: "secondary",
                                            }),
                                            "w-full"
                                        )}
                                    >
                                        Sing-up
                                    </RegisterLink>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

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
