import {NextPage} from "next";
import {api} from "~/utils/api";


const Posts: NextPage = () => {
    const posts = api.posts.getAll.useQuery().data

    return (
        <div>
            <div className={"mt-10"}>
                <h2 className={"text-2xl font-bold sm:text-3xl lg:text-4xl"}>
                    Btw some data from tRPC:
                </h2>
                <ul>
                    {posts && posts.length && posts.map((post) => (
                        <li key={post.id} className={"text-white/80"}>{post.content}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Posts;

