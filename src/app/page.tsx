import Link from "next/link"

import { Button } from "@/components/ui/button"
import { H1 } from "@/components/ui/h1"

export default function Home() {
    return (
        <>
            <div className="-mt-4 flex flex-grow flex-col items-center justify-center">
                <div className="max-w-lg text-center">
                    <H1>
                        <span>Hi, I'm Andrew,</span>
                        <span className="text-sky-500"> Software</span>
                        <span className="text-pink-500"> Engineer</span>
                    </H1>
                </div>
                <div className="mt-9 space-x-2">
                    <Button>
                        <Link href="/blog">Read my blog</Link>
                    </Button>
                    <Button variant={"link"}>
                        <a href="https://github.com/Andrew-Sem">
                            Checkout Github
                        </a>
                    </Button>
                </div>
            </div>
            <div className="vignette absolute -z-10 bg-grid-pattern"></div>
        </>
    )
}
