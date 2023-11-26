import { NoAccess } from "@/components/no-access"
import { getServerAuthSession } from "@/server/auth"
import { type ReactNode } from "react"

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await getServerAuthSession()
    const role = session?.user.role
    if (role !== "admin") return <NoAccess />
    return <>{children}</>
}
