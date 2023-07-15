import { Header } from "@/components/header"

import "./globals.css"
import "./mdx.css"

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
                <main className="container mx-auto flex-grow">{children}</main>
                <Footer />
            </body>
        </html>
    )
}
