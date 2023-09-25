import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs"

import { prisma } from "@/lib/db"
import { type Meme } from "@prisma/client"
import { revalidateTag } from "next/cache"

export const POST = async (req: NextRequest) => {
    const user = await currentUser()
    if (user?.publicMetadata.role !== "admin")
        return new Response(null, {
            status: 403,
            statusText: "Only admin accessible",
        })
    try{
        const {imageSrc, title} = await req.json() as {imageSrc: string, title?:string}
        const newMeme: Meme | undefined = await prisma.meme.create({
            data: {
                imageSrc,
                title,
            },
        })
        return NextResponse.json({ data: newMeme })
    }
    catch(e){
        console.error("Error creating meme:", e);
        return new Response("Internal Server Error", {
            status: 500,
            statusText: "Internal Server Error",
        });
    }
}

export const GET = async (request: NextRequest) => {
    try{
        const memes = await prisma.meme.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return new Response(JSON.stringify(memes))
    } catch(e){
        console.error("Error creating meme:", e);
        return new Response("Internal Server Error", {
            status: 500,
            statusText: "Internal Server Error",
        });
    }
}
