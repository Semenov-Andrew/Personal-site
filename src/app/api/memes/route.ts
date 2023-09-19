import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs"

import { prisma } from "@/lib/db"

export const POST = async (req: Request) => {
    const user = await currentUser()
    if (user?.publicMetadata.role !== "admin")
        return new Response(null, {
            status: 403,
            statusText: "Only admin accessible",
        })
    const { imageSrc, title } = await req.json()
    const newMeme = prisma.meme.create({
        data: {
            imageSrc,
            title,
        },
    })

    return NextResponse.json({ data: newMeme })
}
