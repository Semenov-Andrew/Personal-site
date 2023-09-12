"use client"

import { type FC } from "react"
import {
    ComputerDesktopIcon,
    MoonIcon,
    SunIcon,
} from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "./ui/button"

export const ThemeToggle: FC = () => {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    className="space-x-1 py-0 text-muted-foreground"
                    size={"sm"}
                >
                    <SunIcon className="h-6 w-6 dark:hidden" />
                    <MoonIcon className="hidden h-6 w-6 dark:block" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Themes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="flex space-x-1"
                    onClick={() => setTheme("system")}
                >
                    <ComputerDesktopIcon className="h-4 w-4" />
                    <span>System</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex space-x-1"
                    onClick={() => setTheme("light")}
                >
                    <SunIcon className="h-4 w-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex space-x-1"
                    onClick={() => setTheme("dark")}
                >
                    <MoonIcon className="h-4 w-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
