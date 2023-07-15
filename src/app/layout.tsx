import { Header } from "@/components/header"

import "./globals.css"
import "./mdx.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

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
            <body className={inter.className}>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    )
}
