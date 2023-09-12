import { FC } from "react"
import Image from "next/image"
import { SignInButton, SignOutButton } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/api"
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
import { Button } from "./ui/button"

interface HeaderProps {
    user: User | null
}

export const Header: FC<HeaderProps> = ({ user }) => {
    return (
        <header className="container sticky top-0 z-10 mx-auto flex  items-center justify-between bg-background/50 py-4 backdrop-blur-sm">
            <MainNav />
            <MobileNav />
            <div className="flex">
                <ThemeToggle />
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"ghost"}
                                className="space-x-2 text-muted-foreground"
                                size={"sm"}
                            >
                                <span className="hidden md:block">
                                    {user.firstName}&nbsp;{user.lastName}
                                </span>
                                <Image
                                    src={user?.imageUrl}
                                    height={32}
                                    width={32}
                                    alt="profile pic"
                                    className="shrink-0 cursor-pointer rounded-full"
                                />
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
                        <Button size={"sm"}>Sign In</Button>
                    </SignInButton>
                )}
            </div>
        </header>
    )
}
