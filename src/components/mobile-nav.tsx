"use client"

import { type FC } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navLinks } from "@/constants/nav"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet"

export const MobileNav: FC = () => {
    const pathname = usePathname()
    return (
        <Sheet>
            <SheetTrigger className="lg:hidden" asChild>
                <button>
                    <HamburgerMenuIcon className="h-6 w-6" />
                </button>
            </SheetTrigger>
            <SheetContent side={"left"}>
                <SheetHeader>
                    {navLinks.length ? (
                        <nav className="flex flex-col space-y-4 pt-5">
                            {navLinks.map((link, i) => {
                                let isActiveLink = pathname.startsWith(
                                    link.href
                                )
                                if (link.href === "/" && pathname !== "/")
                                    isActiveLink = false
                                return (
                                    <SheetClose asChild key={link.href}>
                                        <Link
                                            href={link.href}
                                            key={i}
                                            className={cn(
                                                "px-0.5 text-lg font-medium",
                                                isActiveLink
                                                    ? ""
                                                    : "text-muted-foreground duration-150 hover:text-foreground"
                                            )}
                                        >
                                            {link.title}
                                        </Link>
                                    </SheetClose>
                                )
                            })}
                        </nav>
                    ) : null}
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
