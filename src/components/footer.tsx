import { type FC } from "react"
import Image from "next/image"
import { images } from "@/constants/images"

export const Footer: FC = () => {
    return (
        <footer className="py-6">
            <div className="container mx-auto flex justify-between">
                <div className="text-sm">
                    <span className="text-muted-foreground">
                        &#64;&nbsp;{new Date().getFullYear()}&nbsp;
                    </span>
                    <span>Andrew-Sem</span>
                </div>
            </div>
        </footer>
    )
}
