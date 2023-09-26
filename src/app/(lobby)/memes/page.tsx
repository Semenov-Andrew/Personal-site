import { MemeCard } from "@/components/meme-card"
import { Meme } from "@prisma/client"

const getMemes = async () => {
    const res = await fetch(`http://localhost:3000/api/memes`, {next: {
        revalidate: process.env.NODE_ENV === "production" ? 3600 : 1
    }})
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
