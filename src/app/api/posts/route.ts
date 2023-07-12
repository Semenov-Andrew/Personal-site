import { prisma } from "@/lib/db"

export async function GET() {
    try {
        const posts = await prisma.post.findMany()

        return new Response(JSON.stringify(posts))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}
