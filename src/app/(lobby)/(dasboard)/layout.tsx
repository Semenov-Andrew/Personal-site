import { type ReactNode } from "react"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

import { PERMISSIONS } from "@/lib/permissions"
import { NoAccess } from "@/components/no-access"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { getPermission } = getKindeServerSession()
    const dashboardAccess = getPermission(PERMISSIONS.dashboardAccess)
    if (!dashboardAccess.isGranted) return <NoAccess />
    return <>{children}</>
}
