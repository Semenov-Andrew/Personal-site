import { NextResponse, type NextRequest } from "next/server"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { type Meme } from "@prisma/client"

import { prisma } from "@/lib/db"
import { Permissions } from "@/lib/permissions"

export const POST = async (req: NextRequest) => {
    const { getPermission } = getKindeServerSession()
    if (!getPermission(Permissions.dashboardAccess).isGranted)
        return new Response(null, {
            status: 403,
            statusText: "Only admin accessible",
        })
    try {
        const { imageSrc, title } = (await req.json()) as {
            imageSrc: string
            title?: string
        }
        const newMeme: Meme | undefined = await prisma.meme.create({
            data: {
                imageSrc,
                title,
            },
        })
        return NextResponse.json({ data: newMeme })
    } catch (e) {
        console.error("Error creating meme:", e)
        return new Response("Internal Server Error", {
            status: 500,
            statusText: "Internal Server Error",
        })
    }
}

export const GET = async () => {
    try {
        const memes = await prisma.meme.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })
        return new Response(JSON.stringify(memes))
    } catch (e) {
        console.error("Error creating meme:", e)
        return new Response("Internal Server Error", {
            status: 500,
            statusText: "Internal Server Error",
        })
    }
}
