"use client"

import { type FC } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

import { ThemeToggle } from "./theme-toggle"

type NavLink = {
    href: string
    title: string
}

const navLinks: NavLink[] = [
    { href: "/blog", title: "Blog" },
    { href: "/projects", title: "Projects" },
    { href: "/memes", title: "Memes" },
]

export const Header: FC = () => {
    const pathname = usePathname()
    return (
        <header className="container sticky top-0 z-10 mx-auto flex items-center justify-between bg-background/50 py-4 backdrop-blur-sm">
            <div className="flex items-center">
                <Link href="/" className="inline-block items-center">
                    <HomeIcon className="h-6 w-6" />
                </Link>
                {navLinks.length ? (
                    <nav className="ml-6 flex space-x-3 text-sm">
                        {navLinks.map((link, i) => {
                            const isActiveLink = pathname.startsWith(link.href)
                            return (
                                <Link
                                    href={link.href}
                                    key={i}
                                    className={cn(
                                        "px-0.5 font-medium",
                                        isActiveLink
                                            ? ""
                                            : "text-muted-foreground duration-150 hover:text-foreground"
                                    )}
                                >
                                    {link.title}
                                </Link>
                            )
                        })}
                    </nav>
                ) : null}
            </div>
            <div>
                <ThemeToggle />
            </div>
        </header>
    )
}
