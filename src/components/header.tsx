"use client"

import { type FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInButton, SignOutButton } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/dist/types/api"
import { CloudIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

type NavLink = {
    href: string
    title: string
}

const navLinks: NavLink[] = [
    { href: "/blog", title: "Blog" },
    { href: "/projects", title: "Projects" },
]

interface HeaderProps {
    user: User | null
}

export const Header: FC<HeaderProps> = ({ user }) => {
    const pathname = usePathname()

    return (
        <header className="container sticky top-0 z-10 mx-auto flex items-center justify-between bg-background/50 py-4 backdrop-blur-sm">
            <div className="flex items-center">
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
            <div className="flex space-x-2">
                <ThemeToggle />
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"ghost"}
                                className="space-x-2 text-muted-foreground"
                                size={"sm"}
                            >
                                <span>
                                    {user.firstName}&nbsp;{user.lastName}
                                </span>
                                <Image
                                    src={user?.imageUrl}
                                    height={32}
                                    width={32}
                                    alt="profile pic"
                                    className="shrink-0 cursor-pointer rounded-full"
                                />
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <SignOutButton></SignOutButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <SignInButton>
                        <Button size={"sm"} variant={"outline"}>
                            Sign In
                        </Button>
                    </SignInButton>
                )}
            </div>
        </header>
    )
}
