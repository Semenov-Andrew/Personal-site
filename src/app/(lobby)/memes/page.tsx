import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

import { MemeCardContainer } from "@/components/meme-card-container"
import { serverClient } from "@/app/_trpc/server-client"

const MemesPage = async () => {
    const memes = await serverClient.memes.getAll()
    const { isAuthenticated: getIsAuthenticated, getUser } =
        getKindeServerSession()
    const user = getUser()
    const isAuthenticated = getIsAuthenticated()
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col space-y-8">
            {memes?.length ? (
                memes.map((meme) => (
                    <MemeCardContainer
                        meme={meme}
                        isAuthenticated={isAuthenticated}
                        user={user}
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
