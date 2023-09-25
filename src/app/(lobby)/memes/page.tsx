import { MemeCard } from "@/components/meme-card"
import { env } from "@/env.mjs"

export interface Meme {
    id: string
    imageSrc: string
    likesCount: number
    commentsCount: number
    viewsCount: number
}

const getMemes = async () => {
    const res = await fetch(`http://localhost:3000/api/memes`, {next: {revalidate: 1}})
    return res.json() 
}

const MemesPage = async () => {
    const memes:Meme[] = await getMemes()
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col space-y-8">
            {memes.map((meme) => (
                <MemeCard meme={meme} key={meme.id} />
            ))}
        </div>
    )
}

export default MemesPage
