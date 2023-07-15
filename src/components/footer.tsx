import { type FC } from "react"

export const Footer: FC = () => {
    return (
        <footer className="py-6">
            <div className="container mx-auto">
                <div className="text-sm">
                    &#64;&nbsp;{new Date().getFullYear()}&nbsp;
                    <a
                        href="https://github.com/Andrew-Sem"
                        className="border-b border-primary"
                    >
                        Andrew-Sem
                    </a>
                </div>
            </div>
        </footer>
    )
}
