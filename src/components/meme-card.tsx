import { type FC } from "react"
import Image from "next/image"
import { ChatBubbleIcon, EyeOpenIcon, HeartIcon } from "@radix-ui/react-icons"

import { Meme } from "@/app/(lobby)/memes/page"

import { Button } from "./ui/button"

interface MemeCardProps {
    meme: Meme
}

export const MemeCard: FC<MemeCardProps> = ({ meme }) => {
    return (
        <div className="flex min-h-[400px] w-full flex-col overflow-hidden rounded-lg">
            <div className=" flex flex-1 justify-center rounded-md bg-muted px-4 py-2">
                <Image
                    src={meme.imageSrc}
                    height={300}
                    width={300}
                    alt="meme"
                />
            </div>
            <div className="flex justify-between px-4 py-2 text-sm">
                <div className="flex space-x-4">
                    <Button
                        className="flex items-center space-x-2 rounded-full"
                        size={"sm"}
                        variant={"ghost"}
                    >
                        <HeartIcon className="h-5 w-5" />
                        <span>{meme.likesCount}</span>
                    </Button>
                    <Button
                        className="flex items-center space-x-2 rounded-full"
                        size={"sm"}
                        variant={"ghost"}
                    >
                        <ChatBubbleIcon className="h-5 w-5" />
                        <span>{meme.commentsCount}</span>
                    </Button>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <EyeOpenIcon className="h-5 w-5" />
                    <span>{meme.viewsCount}</span>
                </div>
            </div>
        </div>
    )
}
