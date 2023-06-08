import PostCard from "./post_card";
import { DocumentData } from "firebase/firestore";

export default function PostList({
    posts,
    user,
}: {
    posts: DocumentData[]
    user: DocumentData
}) {



    return (
        <>
            {
                posts.map((post) => {
                    return <PostCard
                        key={post.id}
                        post={post}
                        isLiked={user.likedPosts.includes(post.id)}
                    />;
                })


            }
        </>
    );
}