import { useEffect, type FC } from "react"
import Link from "next/link"
import { FireIcon, NoSymbolIcon } from "@heroicons/react/24/solid"
import { allPosts } from "contentlayer/generated"

import { formatDate } from "@/lib/utils"

const Page: FC = () => {
    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold">Blog</h1>
            <hr className="my-6" />
            {allPosts.length ? (
                <div className=" grid grid-cols-2 gap-x-5 gap-y-10">
                    {allPosts.map((post) => (
                        <div className="relative @container first:col-span-2">
                            <article className="overflow-hidden rounded-lg ring-1 ring-secondary">
                                <div className="flex h-56 w-full flex-col items-center justify-center bg-muted text-sm">
                                    <NoSymbolIcon className="h-16 w-16 text-muted-foreground/80" />
                                    <div className="mt-1 text-muted-foreground/80">
                                        Here will be an img
                                    </div>
                                </div>
                                <div className="flex justify-between gap-x-2 p-4">
                                    <div className="space-y-2 @lg:space-y-3">
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
                                    <div className="hidden items-start @lg:flex">
                                        <div className="flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-1.5 text-secondary">
                                            <FireIcon className="h-4 w-4" />
                                            <span className="text-sm">new</span>
                                        </div>
                                    </div>
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
