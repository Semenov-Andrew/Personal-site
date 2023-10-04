import { type ReactNode } from "react"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function LobbyLayout({ children }: { children: ReactNode }) {
    const { getUser } = getKindeServerSession()
    const user = getUser()

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
