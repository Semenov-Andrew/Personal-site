import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { signIn } from "next-auth/react"
import { ReactElement } from "react"

export const LoginRequiredDialog = ({
    triggerBtn,
}: {
    triggerBtn: ReactElement
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Oh, you want to like</DialogTitle>
                    <DialogDescription>
                        Login required. It will take less than 10 seconds
                    </DialogDescription>
                </DialogHeader>
                <Button onClick={() => signIn("github")}>Sign-in</Button>
            </DialogContent>
        </Dialog>
    )
}
