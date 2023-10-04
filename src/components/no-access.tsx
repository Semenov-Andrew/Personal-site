"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ChevronLeftIcon } from "@radix-ui/react-icons"

import { Button } from "./ui/button"

export const NoAccess = () => {
    const router = useRouter()
    return (
        <div className="flex flex-1 flex-col items-center justify-center">
            <h3 className="text-center text-2xl md:text-3xl">
                Sorry, you don't have access to this page 😢
            </h3>
            <Button className="mt-10" onClick={() => router.back()}>
                <ChevronLeftIcon className="mr-1 h-5 w-5" />
                <span>Go back</span>
            </Button>
        </div>
    )
}
