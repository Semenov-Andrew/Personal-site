import { MemeCard } from "@/components/meme-card"

export interface Meme {
    id: string
    imageUrl: string
    likesCount: number
    commentsCount: number
    viewsCount: number
}

const memes: Meme[] = [
    {
        id: "1",
        imageUrl: "/images/memes/meme-1.jpeg",
        likesCount: 123,
        commentsCount: 123,
        viewsCount: 1103,
    },
    {
        id: "2",
        imageUrl: "/images/memes/meme-2.jpeg",
        likesCount: 132,
        commentsCount: 99,
        viewsCount: 937,
    },
]

const MemesPage = () => {
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col space-y-8">
            {memes.map((meme) => (
                <MemeCard meme={meme} key={meme.id} />
            ))}
        </div>
    )
}

export default MemesPage
