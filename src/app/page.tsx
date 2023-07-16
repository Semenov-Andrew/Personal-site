import Link from "next/link"

import { Button } from "@/components/ui/button"
import { H1 } from "@/components/ui/h1"

export default function Home() {
    return (
        <>
            <div className="-mt-4 flex flex-grow flex-col items-center justify-center">
                <div className="max-w-lg text-center">
                    <H1>
                        <span>Hi, I&#39;m Andrew,</span>
                        <span className="text-sky-500"> Software</span>
                        <span className="text-pink-500"> Engineer</span>
                    </H1>
                </div>
                <div className="mt-9 space-x-2">
                    <Link href="/blog">
                        <Button>Read my blog</Button>
                    </Link>
                    <a href="https://github.com/Andrew-Sem">
                        <Button variant={"link"}>Checkout Github</Button>
                    </a>
                </div>
            </div>
            <div className="vignette absolute -z-10 bg-grid-pattern"></div>
        </>
    )
}
