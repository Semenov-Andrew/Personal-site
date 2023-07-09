import {NextPage} from "next";
import {api} from "~/utils/api";
import {FC} from "react"
import {Post as PostType} from "@prisma/client"
import {FilteredUser} from "~/server/helpers/filterUserForClient";
import Image from "next/image"

type PostProps = {
    post: PostType
    author: FilteredUser
}

export const Post: FC<PostProps> = ({post, author}) => {
    return (
        <div className={"bg-black rounded-lg text-white p-4"}>
            <div className={"flex gap-2"}>
                <Image
                    src={author.profileImageUrl}
                    alt={`${author.username}'s picture`}
                    width={40}
                    height={40}
                    className={"rounded-full"}
                />
                <div>
                    {author.firstName && <div>{author.firstName}</div>}
                    {author.username && <div>@{author.username}</div>}
                </div>
            </div>
            <div className={"mt-2"}>{post.content}</div>
        </div>
    );
};


const Posts: NextPage = () => {
    const posts = api.posts.getAll.useQuery().data
    return (
        <div className={"container mx-auto"}>
            <h2 className={"text-2xl font-bold sm:text-3xl lg:text-4xl"}>
                Posts
            </h2>
            <div>
                {posts && posts.length && posts.map(({post, author}) => (
                    <Post post={post} author={author} key={post.id}/>
                ))}
            </div>
        </div>
    );
};

export default Posts;

