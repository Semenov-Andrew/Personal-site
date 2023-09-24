import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs"

import { prisma } from "@/lib/db"

export const POST = async (req: NextRequest) => {
    const user = await currentUser()
    if (user?.publicMetadata.role !== "admin")
        return new Response(null, {
            status: 403,
            statusText: "Only admin accessible",
        })
    try{
        const {imageSrc, title} = await req.json()
        const newMeme = await prisma.meme.create({
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

export const GET = async () => {
    return NextResponse.json({data: "losos"})
}
