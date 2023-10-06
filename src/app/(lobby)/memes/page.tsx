import { MemeCard } from "@/components/meme-card"
import { serverClient } from "@/app/_trpc/server-client"

const MemesPage = async () => {
    const memes = await serverClient.memes.getAll()
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col space-y-8">
            {memes.map((meme) => (
                <MemeCard meme={meme} key={meme.id} />
            ))}
        </div>
    )
}

export default MemesPage
