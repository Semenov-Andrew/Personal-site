import { type FC } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allDocs } from "contentlayer/generated"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/Button"
import { Mdx } from "@/components/mdx-components"

interface PageProps {
    params: {
        slug: string
    }
}

const getDocFromParams = (slug: string) => {
    const doc = allDocs.find((doc) => doc.slugAsParams === slug)
    if (!doc) notFound()
    return doc
}

const page: FC<PageProps> = ({ params }) => {
    const doc = getDocFromParams(params.slug)
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
                <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl">
                    {doc.title}
                </h1>
            </div>
            <Mdx code={doc.body.code} />
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
