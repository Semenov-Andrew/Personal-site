"use client"

import { ReactElement, type FC } from "react"
import Image from "next/image"
import {
    ChatBubbleOvalLeftIcon,
    HeartIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline"
import { type MemeComment, type Meme } from "@prisma/client"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { type UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { type memeCommentSchema } from "@/lib/validations/meme"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/_components/ui/dialog"

import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

dayjs.extend(relativeTime)
dayjs.locale("ru")

interface MemeCardProps {
    meme: Meme
    isAuthenticated: boolean
    isLiked: boolean | undefined
    likesCount: number
    commentsCount: number
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
    currentUserImage: string | null | undefined
    comments: MemeComment[] | undefined
}

export const MemeCard: FC<MemeCardProps> = ({
    meme,
    isAuthenticated,
    isLiked,
    likesCount,
    commentsCount,
    toggleLike,
    isActiveComments,
    setIsActiveComments,
    commentForm,
    onCommentSubmit,
    currentUserImage,
    comments,
}) => {
    return (
        <div className="ml-[calc(50%-50vw)] flex w-screen flex-col overflow-hidden sm:ml-0 sm:w-full ">
            <MemeImage imageSrc={meme.imageSrc} />
            <div className="flex flex-col space-y-3 p-2 text-sm sm:flex-row-reverse sm:justify-between sm:space-y-0 lg:px-4 lg:py-2">
                <div className="flex items-center space-x-1 text-muted-foreground">
                    <span>{meme.viewsCount} views</span>
                    <span>•</span>
                    <div className="">{dayjs(meme.createdAt).fromNow()}</div>
                </div>
                <MemeControl
                    {...{
                        isAuthenticated,
                        isLiked,
                        likesCount,
                        commentsCount,
                        toggleLike,
                        setIsActiveComments,
                        memeId: meme.id,
                    }}
                />
            </div>
            {isActiveComments ? (
                <div className="mx-2 mt-2 border-t py-4 sm:mx-4">
                    <Comments comments={comments} />
                    {isAuthenticated ? (
                        <CommentsForm
                            commentForm={commentForm}
                            onCommentSubmit={onCommentSubmit}
                            currentUserImage={currentUserImage}
                            isAuthenticated={isAuthenticated}
                        />
                    ) : (
                        <Button
                            className="w-full"
                            onClick={() => signIn("github")}
                        >
                            Sign in to leave comments
                        </Button>
                    )}
                </div>
            ) : null}
        </div>
    )
}

interface MemeControlProps {
    isAuthenticated: boolean
    isLiked: boolean | undefined
    toggleLike: ({ memeId }: { memeId: string }) => void
    memeId: string
    likesCount: number
    setIsActiveComments: (isActiveComments: boolean) => void
    commentsCount: number
}

const MemeControl: FC<MemeControlProps> = ({
    isAuthenticated,
    isLiked,
    toggleLike,
    memeId,
    likesCount,
    setIsActiveComments,
    commentsCount,
}) => {
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

const LoginRequiredDialog = ({ triggerBtn }: { triggerBtn: ReactElement }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Oh, you want to like</DialogTitle>
                    <DialogDescription>
                        Login required. It will take less than 10 seconds
                    </DialogDescription>
                </DialogHeader>
                <Button onClick={() => signIn("github")}>Sign-in</Button>
            </DialogContent>
        </Dialog>
    )
}

const MemeImage = ({ imageSrc }: { imageSrc: string }) => {
    return (
        <div className="flex flex-1 items-center justify-center bg-muted sm:rounded-lg lg:px-4 lg:py-2">
            <div className="relative min-h-[420px] flex-1">
                <Image
                    src={imageSrc}
                    fill
                    alt="meme"
                    className="w-full"
                    style={{ objectFit: "contain" }}
                />
            </div>
        </div>
    )
}

interface CommentsFormProps {
    currentUserImage: string | null | undefined
    isAuthenticated: boolean
    commentForm: UseFormReturn<
        {
            text: string
        },
        any,
        undefined
    >
    onCommentSubmit: (values: z.infer<typeof memeCommentSchema>) => void
}

const CommentsForm: FC<CommentsFormProps> = ({
    commentForm,
    onCommentSubmit,
    isAuthenticated,
    currentUserImage,
}) => {
    return (
        <Form {...commentForm}>
            <form onSubmit={commentForm.handleSubmit(onCommentSubmit)}>
                <FormField
                    control={commentForm.control}
                    name="text"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <div className="flex items-center space-x-3">
                                    {isAuthenticated ? (
                                        <Image
                                            src={currentUserImage || ""}
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
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="Leave a comment..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        disabled={field.value.length === 0}
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
    )
}

const Comments = ({ comments }: { comments: MemeComment[] | undefined }) => {
    if (!comments) return <div>Unable to get comments</div>
    if (!comments.length) return null
    return (
        <div className="space-y-4 py-4">
            {comments.map((comment) => (
                <div className="flex" key={comment.id}>
                    <div className="flex space-x-2">
                        <div className="shrink-0">
                            <Image
                                className="rounded-full"
                                src={comment.image}
                                width={40}
                                height={40}
                                alt={`${comment.commentatorName} image`}
                            />
                        </div>
                        <div className="text-sm">
                            <div className="mb-1 font-semibold">
                                {comment.commentatorName}
                            </div>
                            <div>{comment.text}</div>
                            <div className=" mt-1 text-muted-foreground">
                                {dayjs(comment.createdAt).fromNow()}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
