import { PropsWithChildren } from "react"
import { ThemeProvider } from "./theme"
import { headers } from "next/headers"
import { TRPCReactProvider } from "./trpc-react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <TRPCReactProvider headers={headers()}>
            <ReactQueryDevtools initialIsOpen={false} />
            <ThemeProvider attribute="class">{children}</ThemeProvider>
        </TRPCReactProvider>
    )
}
