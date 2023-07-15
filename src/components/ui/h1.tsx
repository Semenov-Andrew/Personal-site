import type { FC, ReactNode } from "react"

interface H1Props {
    children: ReactNode
}

export const H1: FC<H1Props> = ({ children }) => {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
        </h1>
    )
}
