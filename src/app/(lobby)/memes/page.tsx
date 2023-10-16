import { MemeCardContainer } from "@/app/_components/meme-card-container"
import { getServerAuthSession } from "@/server/auth"
import { api } from "@/trpc/server"

const MemesPage = async () => {
    const memes = await api.memes.getAll.query()
    const session = await getServerAuthSession()
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col space-y-8">
            {memes?.length ? (
                memes.map((meme) => (
                    <MemeCardContainer
                        meme={meme}
                        isAuthenticated={!!session?.user}
                        user={session?.user}
                        key={meme.id}
                    />
                ))
            ) : (
                <div>No memes yet</div>
            )}
        </div>
    )
}

export default MemesPage
