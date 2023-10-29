import { useInfiniteQuery } from "@tanstack/react-query"

const posts: { title: string }[] = [
    { title: "post 1" },
    { title: "post 2" },
    { title: "post 3" },
    { title: "post 4" },
    { title: "post 5" },
    { title: "post 6" },
]

const fetchPosts = async (page: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return posts.slice((page - 1) * 2, page * 2)
}

export const Posts = () => {
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
        ["query"],
        async ({ pageParam = 1 }) => {
            const res = await fetchPosts(pageParam)
            return res
        },
        {
            getNextPageParam: (_, pages) => {
                return pages.length + 1
            },
            initialData: {
                pages: [posts.slice(0, 2)],
                pageParams: [1],
            },
        }
    )

    return (
        <div>
            {data?.pages.map((page, i) => (
                <div key={i}>
                    {page.map((post) => (
                        <div key={post.title}>{post.title}</div>
                    ))}
                </div>
            ))}
            <button
                onClick={() => {
                    fetchNextPage()
                }}
                disabled={isFetchingNextPage}
            >
                {isFetchingNextPage
                    ? "Loading more..."
                    : (data?.pages.length ?? 0) < 3
                    ? "Load more"
                    : "Nothing more to load"}
            </button>
        </div>
    )
}
