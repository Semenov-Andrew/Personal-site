import { Header } from "@/components/header"

import "@/styles/globals.css"
import "@/styles/mdx.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider, currentUser, useUser } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Andrew Semyonov",
    description: "Andrew's Semyonov website",
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await currentUser()
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body
                    className={cn(
                        inter.className,
                        "flex min-h-screen flex-col"
                    )}
                >
                    <ThemeProvider attribute="class">
                        <Header user={user} />
                        <main className="container relative mx-auto flex flex-grow flex-col pt-4">
                            {children}
                        </main>
                        <Footer />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
