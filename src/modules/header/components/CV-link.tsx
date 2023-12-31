import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import Link from "next/link"

export const CVLink = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 px-0.5 text-lg font-medium text-muted-foreground duration-150 hover:text-foreground lg:text-sm">
                <span>CV</span>
                <ChevronDownIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <Link target="_blank" href={"/files/CV(en).pdf"}>
                    <DropdownMenuItem>EN</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link target="_blank" href={"/files/CV(ru).pdf"}>
                    <DropdownMenuItem>RU</DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
