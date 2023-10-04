import { type ReactNode } from "react"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

import { Permissions } from "@/lib/permissions"
import { NoAccess } from "@/components/no-access"

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const { getPermission } = getKindeServerSession()
    const dashboardAccess = getPermission(Permissions.dashboardAccess)
    if (!dashboardAccess.isGranted) return <NoAccess />
    return <>{children}</>
}
