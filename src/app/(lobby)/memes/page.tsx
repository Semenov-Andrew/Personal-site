"use client"

import { Spinner } from "@/components/ui/spinner"
import { MemeCard } from "@/components/meme-card"
import { trpc } from "@/app/_trpc/client"

const MemesPage = () => {
    const { data: losos } = trpc.memes.getAll.useQuery()
    const {
        data: memes,
        isLoading,
        isError,
        error,
    } = trpc.memes.getAll.useQuery()
    if (isLoading)
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Spinner />
            </div>
        )
    if (isError) return <div>Error: {error.message}</div>
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col space-y-8">
            {memes?.length ? (
                memes.map((meme) => <MemeCard meme={meme} key={meme.id} />)
            ) : (
                <div>No memes yet</div>
            )}
        </div>
    )
}

export default MemesPage
