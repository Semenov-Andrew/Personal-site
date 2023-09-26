import { type FC } from "react"
import Image from "next/image"

import { Button } from "./ui/button"
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import {EyeIcon} from "@heroicons/react/20/solid"
import { Meme } from "@prisma/client"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale('ru');

interface MemeCardProps {
    meme: Meme
}

export const MemeCard: FC<MemeCardProps> = ({ meme }) => {
    return (
        <div className="flex flex-col overflow-hidden w-screen sm:w-full ml-[calc(50%-50vw)] sm:ml-0 ">
            <div className="flex flex-1 justify-center items-center bg-muted lg:px-4 lg:py-2 sm:rounded-lg">
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
            <div className="flex flex-col sm:flex-row-reverse sm:justify-between space-y-3 sm:space-y-0 p-2 lg:py-2 lg:px-4 text-sm">
                <div className="flex items-center space-x-1 text-muted-foreground">
                    <span>{meme.viewsCount} views</span>
                    <span>•</span>
                    <div className="">
                        {dayjs(meme.createdAt).fromNow()}
                    </div>
                </div>
                <div className="flex md:space-x-3 space-x-2">
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
            </div>

        </div>
    )
}
