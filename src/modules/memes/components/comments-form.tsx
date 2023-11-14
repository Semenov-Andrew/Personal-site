import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { memeCommentSchema } from "../validations/comment-schema"
import { api } from "@/trpc/react"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import { type User } from "next-auth"
import { signIn } from "next-auth/react"
import { type FC } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"
import Image from "next/image"
import { type MemeComment } from "@prisma/client"

interface CommentsFormProps {
    isAuthenticated: boolean
    currentUser: User | undefined
    memeId: string
    setIsCommentSent: (isCommentSent: boolean) => void
}

export const CommentsForm: FC<CommentsFormProps> = ({
    isAuthenticated,
    currentUser,
    memeId,
    setIsCommentSent,
}) => {
    const utils = api.useUtils()
    const { mutate: comment } = api.memes.comment.useMutation({
        // optimistic comment sending
        onMutate: async ({ text, memeId }) => {
            if (!currentUser?.id) throw new Error("unauthorized")
            // reset old from first page query
            await utils.memes.getInfiniteComments.reset({
                memeId,
                isFromLastPage: false,
            })
            // cancel comments query
            await utils.memes.getInfiniteComments.cancel({
                memeId,
                isFromLastPage: true,
            })
            // get prev comments pages
            const prevCommentsPages =
                utils.memes.getInfiniteComments.getInfiniteData({
                    memeId,
                    isFromLastPage: true,
                })
            // create new optimistic comment
            const optimisticComment: MemeComment = {
                id: Math.random().toString(),
                commentatorId: currentUser.id,
                commentatorName: currentUser.name || "",
                image: currentUser.image || "",
                memeId,
                createdAt: new Date(),
                text,
            }
            utils.memes.getInfiniteComments.setInfiniteData(
                { memeId, isFromLastPage: true },
                (oldQueryData) => {
                    if (!oldQueryData) {
                        return {
                            pages: [
                                {
                                    comments: [optimisticComment],
                                    nextCursor: undefined,
                                    prevCursor: undefined,
                                },
                            ],
                            pageParams: [],
                        }
                    }
                    const updatedPages = oldQueryData.pages.map(
                        (page, pageIndex) => {
                            if (pageIndex === 0) {
                                return {
                                    ...page,
                                    comments: [
                                        ...page.comments,
                                        optimisticComment,
                                    ],
                                }
                            }
                            return page
                        }
                    )
                    return {
                        ...oldQueryData,
                        pages: updatedPages,
                    }
                }
            )
            await utils.memes.getCommentsCount.cancel({ memeId })
            const prevCommentsCount = utils.memes.getCommentsCount.getData({
                memeId,
            })
            utils.memes.getCommentsCount.setData(
                { memeId },
                (oldQueryData) => (oldQueryData ?? 0) + 1
            )
            setIsCommentSent(true)
            return {
                commentsCount: prevCommentsCount,
                commentsPages: prevCommentsPages,
            }
        },
        onError: (_, __, ctx) => {
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
        commentForm.setFocus("text")
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
