"use client"

import { type FC } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navLinks } from "@/constants/nav"
import { CloudIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"

export const MainNav: FC = () => {
    const pathname = usePathname()

    return (
        <div className="hidden items-center lg:flex">
            <Link href="/" className="inline-block items-center">
                <CloudIcon className="h-6 w-6" />
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
    )
}
