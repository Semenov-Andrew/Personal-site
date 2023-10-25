import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { memeCommentSchema } from "@/lib/validations/meme"
import { api } from "@/trpc/react"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import { type MemeComment } from "@prisma/client"
import { type User } from "next-auth"
import { signIn } from "next-auth/react"
import { type FC } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"
import Image from "next/image"

interface CommentsFormProps {
    isAuthenticated: boolean
    currentUser: User | undefined
    memeId: string
}

export const CommentsForm: FC<CommentsFormProps> = ({
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
