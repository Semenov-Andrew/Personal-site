"use client"

import { type FC } from "react"
import Image from "next/image"
import { RouterInputs } from "@/server/trpc"
import {
    ChatBubbleOvalLeftIcon,
    HeartIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline"
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server"
import { MemeComment, type Meme } from "@prisma/client"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { memeCommentSchema } from "@/lib/validations/meme"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button, buttonVariants } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

dayjs.extend(relativeTime)
dayjs.locale("ru")

interface MemeCardProps {
    meme: Meme
    isAuthenticated: boolean
    isLiked: boolean | undefined
    likesCount: number
    toggleLike: ({ memeId }: { memeId: string }) => void
    isActiveComments: boolean
    setIsActiveComments: (isActiveComments: boolean) => void
    commentForm: UseFormReturn<
        {
            text: string
        },
        any,
        undefined
    >
    onCommentSubmit: (values: z.infer<typeof memeCommentSchema>) => void
    picture: string | null
    comments: MemeComment[] | undefined
}

export const MemeCard: FC<MemeCardProps> = ({
    meme,
    isAuthenticated,
    isLiked,
    likesCount,
    toggleLike,
    isActiveComments,
    setIsActiveComments,
    commentForm,
    onCommentSubmit,
    picture,
    comments,
}) => {
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
                    {isAuthenticated ? (
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
                        onClick={() => setIsActiveComments(true)}
                    >
                        <ChatBubbleOvalLeftIcon className="h-6 w-6" />
                        <span>{meme.commentsCount}</span>
                    </Button>
                </div>
            </div>
            {isActiveComments ? (
                <div className="mx-2 mt-2 border-t py-4 sm:mx-4">
                    <Comments comments={comments} />
                    <Form {...commentForm}>
                        <form
                            onSubmit={commentForm.handleSubmit(onCommentSubmit)}
                        >
                            <FormField
                                control={commentForm.control}
                                name="text"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <div className="flex items-center space-x-3">
                                                {isAuthenticated ? (
                                                    <Image
                                                        src={picture || ""}
                                                        height={40}
                                                        width={40}
                                                        alt="your pic"
                                                        className="rounded-full"
                                                    />
                                                ) : (
                                                    <div className="h-[40px] w-[40px] shrink-0 rounded-full bg-secondary"></div>
                                                )}

                                                <FormControl>
                                                    <Input
                                                        autoFocus
                                                        placeholder="Leave a comment..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <Button
                                                    disabled={
                                                        field.value.length === 0
                                                    }
                                                    type="submit"
                                                    variant={"ghost"}
                                                    size={"sm"}
                                                >
                                                    <PaperAirplaneIcon className="h-6 w-6" />
                                                </Button>
                                            </div>

                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                        </form>
                    </Form>
                </div>
            ) : null}
        </div>
    )
}

const Comments = ({ comments }: { comments: MemeComment[] | undefined }) => {
    console.log(comments)
    if (!comments) return <div>Unable to get comments</div>
    return (
        <div>
            {comments.map((comment, i) => (
                <div key={i}>{comment.text}</div>
            ))}
        </div>
    )
}
