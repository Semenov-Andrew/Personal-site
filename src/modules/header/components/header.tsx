"use client"
import { type FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDownIcon } from "@radix-ui/react-icons"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { type User } from "next-auth"
import { signIn, signOut } from "next-auth/react"

interface HeaderProps {
    user: User | undefined
    dashboardAccess: boolean
}

export const Header: FC<HeaderProps> = ({ user, dashboardAccess }) => {
    return (
        <header className="container sticky top-0 z-10 mx-auto flex  items-center justify-between bg-background/50 py-4 backdrop-blur-sm">
            <MainNav />
            <MobileNav />
            <div className="flex lg:space-x-2">
                <ThemeToggle />
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"ghost"}
                                className="space-x-2"
                                size={"sm"}
                            >
                                <span className="hidden md:block">
                                    {user.name}
                                </span>
                                <Image
                                    src={user.image || ""}
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
                            {dashboardAccess ? (
                                <>
                                    <Link href={"/dashboard"}>
                                        <DropdownMenuItem>
                                            Dashboard
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                </>
                            ) : null}
                            <DropdownMenuItem onClick={() => signOut()}>
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button size={"sm"} onClick={() => signIn("github")}>
                        Sign In
                    </Button>
                )}
            </div>
        </header>
    )
}
