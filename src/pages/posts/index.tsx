import {type NextPage} from "next";
import {api} from "~/utils/api";
import {type FC} from "react"
import {type Post as PostType} from "@prisma/client"
import {type FilteredUser} from "~/server/helpers/filterUserForClient";
import Image from "next/image"

type PostProps = {
    post: PostType
}

export const Post: FC<PostProps> = ({post}) => {
    return (
        <div className={"rounded-lg text-white p-4"}>
            <div className={"flex gap-2"}>
            </div>
            <div className={"mt-2"}>{post.content}</div>
        </div>
    );
};


const PostsList: FC = () => {
    const {data: posts, error, isLoading} = api.posts.getAll.useQuery()
    if (error) return <div className={"text-destructive-foreground"}>Error: {error.message}</div>
    if (isLoading) return <div>Loading ...</div>
    return (
        <div>
            {posts && posts.length && posts.map((post) => (
                <Post post={post} key={post.id}/>
            ))}
        </div>
    )
}

const PostsForm: FC = () => {
    return <form>
        <textarea className={"w-full px-4 py-2 border "}/>
    </form>
}

const Posts: NextPage = () => {
    // start fetching asap
    api.posts.getAll.useQuery()
    return (
        <div className={"container mx-auto flex flex-col gap-y-2"}>
            <h2 className={"text-2xl font-bold sm:text-3xl lg:text-4xl"}>
                Posts
            </h2>
            <PostsForm/>
            <PostsList/>
        </div>
    );
};

export default Posts;

