"use client"

import { ReactElement, type FC, useState } from "react"
import Image from "next/image"
import {
    ChatBubbleOvalLeftIcon,
    HeartIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/outline"
import { type MemeComment, type Meme } from "@prisma/client"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { memeCommentSchema } from "@/lib/validations/meme"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { User } from "next-auth"
import { useToast } from "./ui/use-toast"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "./ui/spinner"

dayjs.extend(relativeTime)
dayjs.locale("ru")

interface MemeCardProps {
    isAuthenticated: boolean
    user: User | undefined
    meme: Meme
}

export const MemeCard: FC<MemeCardProps> = ({
    meme,
    isAuthenticated,
    user,
}) => {
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
                <MemeControl
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

interface MemeControlProps {
    isAuthenticated: boolean
    memeId: string
    initialLikesCount: number
    setIsActiveComments: (isActiveComments: boolean) => void
    initialCommentsCount: number
}

const MemeControl: FC<MemeControlProps> = ({
    isAuthenticated,
    memeId,
    setIsActiveComments,
    initialCommentsCount,
    initialLikesCount,
}) => {
    const { toast } = useToast()
    const utils = api.useContext()
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
    isAuthenticated: boolean
    currentUser: User | undefined
    memeId: string
}

const CommentsForm: FC<CommentsFormProps> = ({
    isAuthenticated,
    currentUser,
    memeId,
}) => {
    const utils = api.useContext()
    const { mutate: comment } = api.memes.comment.useMutation({
        // optimistic comment sending
        onMutate: async ({ text, memeId }) => {
            await utils.memes.getComments.cancel({ memeId })
            await utils.memes.getCommentsCount.cancel({ memeId })
            const prevComments = utils.memes.getComments.getData({
                memeId,
            })
            const prevCommentsCount = utils.memes.getCommentsCount.getData({
                memeId,
            })
            const optimisticComment: MemeComment = {
                id: Math.random().toString(),
                commentatorId: currentUser?.id || Math.random().toString(),
                commentatorName: currentUser?.name || "",
                image: currentUser?.image || "",
                memeId,
                createdAt: new Date(),
                text: text,
            }
            utils.memes.getComments.setData({ memeId }, (oldQueryData) => [
                ...(oldQueryData ?? []),
                optimisticComment,
            ])
            utils.memes.getCommentsCount.setData(
                { memeId },
                (oldQueryData) => (oldQueryData ?? 0) + 1
            )
            return { comments: prevComments, commentsCount: prevCommentsCount }
        },
        onError: (_, __, ctx) => {
            utils.memes.getComments.setData({ memeId }, ctx?.comments ?? [])
            utils.memes.getCommentsCount.setData(
                { memeId },
                ctx?.commentsCount ?? 0
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
            memeId,
            text: values.text,
        })
        commentForm.reset()
    }
    return isAuthenticated ? (
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
                                            src={currentUser?.image || ""}
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
    ) : (
        <Button className="w-full" onClick={() => signIn("github")}>
            Sign in to leave comments
        </Button>
    )
}

const Comments = ({ memeId }: { memeId: string }) => {
    const { data: comments, isLoading } = api.memes.getComments.useQuery({
        memeId,
    })
    if (isLoading)
        return (
            <div className="flex justify-center py-3">
                <Spinner />
            </div>
        )
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
