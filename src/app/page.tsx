import Image from "next/image"
import Link from "next/link"
import { images } from "@/constants/images"

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
                <div className="mt-9 flex space-x-2">
                    <Link href="/blog">
                        <Button>Read my blog</Button>
                    </Link>
                    <a href="https://github.com/Andrew-Sem">
                        <Button className="flex" variant={"link"}>
                            <Image
                                className="hidden dark:block"
                                src={images.githubWhite}
                                width={20}
                                height={20}
                                alt="GitHub logo"
                            />
                            <Image
                                className="dark:hidden"
                                src={images.github}
                                width={20}
                                height={20}
                                alt="GitHub logo"
                            />
                            <span className="ml-2">Checkout Github</span>
                        </Button>
                    </a>
                </div>
            </div>
            <div className="vignette absolute -z-10 bg-grid-pattern"></div>
        </>
    )
}
