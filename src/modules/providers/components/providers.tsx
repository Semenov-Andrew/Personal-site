import { PropsWithChildren } from "react"
import { ThemeProvider } from "./theme"
import { headers } from "next/headers"
import { TRPCReactProvider } from "./trpc-react"

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <TRPCReactProvider headers={headers()}>
            <ThemeProvider attribute="class">{children}</ThemeProvider>
        </TRPCReactProvider>
    )
}
