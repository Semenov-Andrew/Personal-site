import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline"

export const CVLink = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 px-0.5 text-lg font-medium text-muted-foreground duration-150 hover:text-foreground lg:text-sm">
                <span>CV</span>
                <ChevronDownIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex items-center gap-4 p-4">
                <WrenchScrewdriverIcon className="h-8 w-8 text-amber-500" />
                <div>
                    <div>There is a tech works now</div>
                    <div className="text-sm text-muted-foreground">
                        <p>You can always reach me by</p>
                        <a href="t.me/keax4208" className="text-sky-500">
                            Telegram
                        </a>
                        &nbsp;or&nbsp;
                        <a
                            href="mailto:andrew.semyonov02@gmail.com"
                            className="text-sky-500"
                        >
                            Email
                        </a>
                        .
                    </div>
                </div>
                {/* 
                <Link target="_blank" href={"/files/CV(en).pdf"}>
                    <DropdownMenuItem>EN</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link target="_blank" href={"/files/CV(ru).pdf"}>
                    <DropdownMenuItem>RU</DropdownMenuItem>
                </Link>
                 */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
