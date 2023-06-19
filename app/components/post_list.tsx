import PostCard from "./post_card";
import { DocumentData } from "firebase/firestore";

export default function PostList({
    posts,
    user,
    canBeDeleted = false
}: {
    posts: DocumentData[]
    user: DocumentData,
    canBeDeleted?: boolean
}) {



    return (
        <>
            {
                posts.map((post) => {
                    return <PostCard
                        key={post.id}
                        post={post}
                        isLiked={user.likedPosts.includes(post.id)}
                        user={user}
                        canBeDeleted={canBeDeleted}
                    />;
                })
            }
        </>
    );
}