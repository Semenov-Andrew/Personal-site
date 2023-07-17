import { Header } from "@/components/header"

import "@/styles/globals.css"
import "@/styles/mdx.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"

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
        <html lang="en">
            <body className={cn(inter.className, "flex min-h-screen flex-col")}>
                <Header />
                <main className="container relative mx-auto flex flex-grow flex-col pt-4">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
