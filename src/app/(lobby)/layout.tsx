import { type ReactNode } from "react"
import { currentUser } from "@clerk/nextjs"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default async function LobbyLayout({
    children,
}: {
    children: ReactNode
}) {
    const user = await currentUser()
    return (
        <>
            <Header user={user} />
            <main className="container relative mx-auto flex flex-grow flex-col pt-4">
                {children}
            </main>
            <Footer />
        </>
    )
}
