"use client"

import { type FC } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navLinks } from "@/constants/nav"

import { cn } from "@/lib/utils"

export const MainNav: FC = () => {
    const pathname = usePathname()

    return (
        <div className="hidden items-center lg:flex">
            {navLinks.length ? (
                <nav className="ml-6 flex space-x-3 text-sm">
                    {navLinks.map((link, i) => {
                        let isActiveLink = pathname.startsWith(link.href)
                        if (link.href === "/" && pathname !== "/")
                            isActiveLink = false
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
