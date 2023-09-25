import { type FC } from "react"
import Image from "next/image"
import { Meme } from "@/app/(lobby)/memes/page"

import { Button } from "./ui/button"
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import {EyeIcon} from "@heroicons/react/20/solid"

interface MemeCardProps {
    meme: Meme
}

export const MemeCard: FC<MemeCardProps> = ({ meme }) => {
    return (
        <div className="flex flex-col overflow-hidden w-screen sm:w-full ml-[calc(50%-50vw)] sm:ml-0">
            <div className="flex flex-1 justify-center items-center bg-muted sm:rounded-lg lg:px-4 lg:py-2 ">
                <div className="flex-1 relative min-h-[420px]">
                    <Image
                        src={meme.imageSrc}
                        fill
                        alt="meme"
                        className="w-full"
                        style={{objectFit: "contain"}}
                    />
                </div>
            </div>
            <div className="flex justify-between py-2 px-4 text-sm">
                <div className="flex space-x-3">
                    <Button
                        className="flex items-center space-x-2 rounded-full"
                        size={"sm"}
                        variant={"secondary"}
                    >
                        <HeartIcon className="w-6 h-6"/>
                        <span>{meme.likesCount}</span>
                    </Button>
                    <Button
                        className="flex items-center space-x-2 rounded-full"
                        size={"sm"}
                        variant={"secondary"}
                    >
                        <ChatBubbleOvalLeftIcon className="h-6 w-6" />
                        <span>{meme.commentsCount}</span>
                    </Button>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <EyeIcon className="h-4 w-4" />
                    <span>{meme.viewsCount}</span>
                </div>
            </div>
        </div>
    )
}
