import { type ReactNode } from "react"

import { Footer } from "@/modules/footer"
import { Header } from "@/modules/header"
import { getServerAuthSession } from "@/server/auth"

export default async function LobbyLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await getServerAuthSession()
    return (
        <>
            <Header
                user={session?.user}
                dashboardAccess={session?.user.role === "admin"}
            />
            <main className="container relative mx-auto flex flex-grow flex-col pt-4">
                {children}
            </main>
            <Footer />
        </>
    )
}
