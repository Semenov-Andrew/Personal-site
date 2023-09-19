import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const user = await currentUser()
    if (user?.publicMetadata.role !== "admin") redirect("/")
    return <>{children}</>
}
