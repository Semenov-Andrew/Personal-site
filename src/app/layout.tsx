import "@/styles/globals.css"
import "@/styles/mdx.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { QueryProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Andrew Semyonov",
    description: "Andrew's Semyonov website",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={cn(inter.className, "flex min-h-screen flex-col")}>
                <ThemeProvider attribute="class">
                    <QueryProvider>
                        {children}
                        <Toaster />
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
