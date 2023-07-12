import { type FC } from "react"

import { prisma } from "@/lib/db"

const getPosts = async () => {
    const posts = await prisma.post.findMany()
    return posts
}

const Posts: FC = async () => {
    const posts = await getPosts()
    return (
        <main>
            {posts.map((post) => (
                <div key={post.id}>{post.content}</div>
            ))}
        </main>
    )
}

export default Posts
