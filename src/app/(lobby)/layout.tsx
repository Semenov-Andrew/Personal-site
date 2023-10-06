import { type ReactNode } from "react"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

import { PERMISSIONS } from "@/lib/permissions"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function LobbyLayout({ children }: { children: ReactNode }) {
    const { getUser, getPermission } = getKindeServerSession()
    const user = getUser()
    const dashboardAccess = getPermission(PERMISSIONS.dashboardAccess)

    return (
        <>
            <Header user={user} dashboardAccess={dashboardAccess} />
            <main className="container relative mx-auto flex flex-grow flex-col pt-4">
                {children}
            </main>
            <Footer />
        </>
    )
}
