import Image from "next/image"
import Link from "next/link"
import { images } from "@/constants/images"
import { ArrowUpRightIcon } from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import { H1 } from "@/components/ui/h1"

export default function Home() {
    return (
        <>
            <div className="-mt-4 flex flex-grow flex-col items-center justify-center">
                <div className="max-w-2xl text-center">
                    <H1>
                        <span>Hi, I&#39;m Andrew,</span>
                        <span className="text-sky-500"> Software</span>
                        <span className="text-pink-500"> Engineer</span>
                    </H1>
                </div>
                <p className="mt-5 text-center text-muted-foreground">
                    Note that this app is still under heavy development
                </p>
                <div className="mt-10 flex space-x-2">
                    <Link href="/blog">
                        <Button>Read my blog</Button>
                    </Link>
                    <a href="https://github.com/Andrew-Sem">
                        <Button className="flex" variant={"outline"}>
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
                            <span className="ml-2 flex space-x-1">
                                <span className="h-auto">Checkout Github</span>
                                <ArrowUpRightIcon className="h-3 w-3 underline underline-offset-4" />
                            </span>
                        </Button>
                    </a>
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -z-10 h-full max-h-[500px] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 transform">
                <div className="h-full w-full bg-grid-pattern shadow-vignette-xs sm:shadow-vignette" />
            </div>
        </>
    )
}
