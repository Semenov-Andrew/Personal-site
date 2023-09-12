import { FC } from "react"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export const MobileNav: FC = () => {
    // Можно сделать так: сделать один общий хэдер
    // и в нём подключить навигацию мобильную и навигацию основную
    // соотвественно, правая часть останется та же
    return (
        <Sheet>
            <SheetTrigger className="lg:hidden" asChild>
                <HamburgerMenuIcon className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side={"left"}>
                <SheetHeader>
                    <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
