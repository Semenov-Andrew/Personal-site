import { type FC } from "react"
import { notFound } from "next/navigation"
import { allDocs } from "contentlayer/generated"

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
        <div className="container mx-auto flex flex-col gap-y-4 py-4">
            <h1 className="text-3xl">{doc.title}</h1>
            <p className="text-neutral-500">{doc.description}</p>
            <Mdx code={doc.body.code} />
        </div>
    )
}

export default page
