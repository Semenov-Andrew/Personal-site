import { type FC } from "react"
import Link from "next/link"
import { FireIcon, NoSymbolIcon } from "@heroicons/react/24/solid"
import { allPosts } from "contentlayer/generated"
import { compareDesc } from "date-fns"

import { formatDate } from "@/lib/utils"

const Page: FC = () => {
    const posts = allPosts.sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date))
    })
    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold">Blog</h1>
            <hr className="my-6" />
            {posts.length ? (
                <div className=" grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2">
                    {posts.map((post) => (
                        <div className="relative @container first:sm:col-span-2">
                            <article className="overflow-hidden rounded-lg ring-1 ring-secondary">
                                <div className="flex h-56 w-full flex-col items-center justify-center bg-muted text-sm">
                                    <NoSymbolIcon className="h-16 w-16 text-muted-foreground/80" />
                                    <div className="mt-1 text-muted-foreground/80">
                                        Here will be an img
                                    </div>
                                </div>
                                <div className="space-y-2 p-4 @lg:space-y-3">
                                    <h2 className="text-xl @lg:text-2xl @lg:font-medium">
                                        {post.title}
                                    </h2>
                                    <p className="text-muted-foreground @lg:text-lg">
                                        {post.description}
                                    </p>
                                    <p className="text-sm font-light text-muted-foreground @lg:text-base">
                                        {formatDate(post.date)}
                                    </p>
                                </div>
                            </article>
                            <Link href={post.slug} className="absolute inset-0">
                                <span className="sr-only">View article</span>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div>Not posts yet</div>
            )}
        </div>
    )
}

export default Page
