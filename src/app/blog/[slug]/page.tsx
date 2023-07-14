import { type FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allAuthors, allPosts } from "contentlayer/generated"

import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import { Mdx } from "@/components/mdx-components"

interface PageProps {
    params: {
        slug: string
    }
}

const getPostFromParams = (slug: string) => {
    const post = allPosts.find((post) => post.slugAsParams === slug)
    if (!post) notFound()
    return post
}

const page: FC<PageProps> = ({ params }) => {
    const post = getPostFromParams(params.slug)
    const authors = post.authors.map((author) =>
        allAuthors.find(({ slug }) => slug === `/authors/${author}`)
    )
    return (
        <article className="container relative max-w-3xl py-6 lg:py-10">
            <Link
                href="/blog"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-[-200px] top-14 hidden xl:inline-flex"
                )}
            >
                See all posts
            </Link>
            <div>
                {post.date && (
                    <time
                        dateTime={post.date}
                        className="block text-sm text-muted-foreground"
                    >
                        Published on {formatDate(post.date)}
                    </time>
                )}
                <h1 className="mt-2 inline-block font-heading text-3xl font-bold leading-tight lg:text-4xl">
                    {post.title}
                </h1>
                {authors?.length ? (
                    <div className="mt-4 flex space-x-4">
                        {authors.map((author) =>
                            author ? (
                                <Link
                                    key={author._id}
                                    href={`https://github.com/${author.github}`}
                                    className="flex items-center space-x-2 text-sm"
                                >
                                    <Image
                                        src={author.avatar}
                                        alt={author.title}
                                        width={42}
                                        height={42}
                                        className="rounded-full bg-white "
                                    />
                                    <div className="flex-1 text-left leading-tight">
                                        <p className="font-medium">
                                            {author.title}
                                        </p>
                                        <p className="text-[12px] text-muted-foreground">
                                            @{author.github}
                                        </p>
                                    </div>
                                </Link>
                            ) : null
                        )}
                    </div>
                ) : null}
            </div>
            <Mdx code={post.body.code} />
            <hr className="mt-12" />
            <div className="flex justify-center py-6 lg:py-10">
                <Link
                    href="/blog"
                    className={cn(buttonVariants({ variant: "ghost" }))}
                >
                    See all posts
                </Link>
            </div>
        </article>
    )
}

export default page
