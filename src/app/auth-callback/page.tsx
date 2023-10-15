"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { Spinner } from "@/components/ui/spinner"

import { trpc } from "../_trpc/client"

const Page = () => {
    const router = useRouter()

    const searchParams = useSearchParams()
    const origin = searchParams.get("origin")

    trpc.auth.callback.useQuery(undefined, {
        onSuccess: ({ success }) => {
            if (success) {
                // user is synced to db
                router.push(origin ? `/${origin}` : "/")
            }
        },
        onError: (err) => {
            if (err.data?.code === "UNAUTHORIZED") {
                router.push("/sign-in")
            }
        },
        retry: true,
        retryDelay: 500,
    })

    return (
        <div className="mt-24 flex w-full justify-center">
            <div className="flex flex-col items-center gap-2">
                <Spinner />
                <h3 className="text-xl font-semibold">
                    Setting up your account...
                </h3>
                <p>You will be redirected automatically.</p>
            </div>
        </div>
    )
}

export default Page
