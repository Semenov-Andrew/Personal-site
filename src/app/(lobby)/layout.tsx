import { type ReactNode } from "react"

import { Footer } from "@/app/_components/footer"
import { Header } from "@/app/_components/header"
import { getServerAuthSession } from "@/server/auth"

export default async function LobbyLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await getServerAuthSession()
    return (
        <>
            <Header user={session?.user} dashboardAccess={true} />
            <main className="container relative mx-auto flex flex-grow flex-col pt-4">
                {children}
            </main>
            <Footer />
        </>
    )
}
