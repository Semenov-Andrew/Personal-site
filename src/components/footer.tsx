import { type FC } from "react"

export const Footer: FC = () => {
    return (
        <footer className="mt-10 py-6">
            <div className="container mx-auto flex items-center justify-between">
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
