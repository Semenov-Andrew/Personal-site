"use client"

import { type FC } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CloudIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"

type NavLink = {
    href: string
    title: string
}

const navLinks: NavLink[] = [
    { href: "/blog", title: "Blog" },
    { href: "/pricing", title: "Pricing" },
]

export const Header: FC = () => {
    const pathname = usePathname()
    return (
        <header className="container mx-auto flex items-center py-4">
            <Link href="/" className="inline-flex items-center space-x-2">
                <CloudIcon className="h-6 w-6" />
                <span className="font-bold">Andrew</span>
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
                                    "px-0.5",
                                    isActiveLink
                                        ? "relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary/20"
                                        : "text-muted-foreground duration-150 hover:text-foreground"
                                )}
                            >
                                {link.title}
                            </Link>
                        )
                    })}
                </nav>
            ) : null}
        </header>
    )
}
