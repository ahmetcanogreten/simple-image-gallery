import { collection, DocumentData, updateDoc, doc, arrayUnion, arrayRemove, where, query, getDocs } from "firebase/firestore";
import { auth, db } from "@/app/firebase_config";
import { useEffect, useState } from "react";



export default function PostCard({ post, isLiked }: { post: DocumentData, isLiked: boolean }) {

    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        getLikeCount();
    }, [isLiked]);

    const getLikeCount = async () => {
        let usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('likedPosts', 'array-contains', post.id));
        const querySnapshot = await getDocs(q);
        const count = querySnapshot.size;
        setLikeCount(count);
    }


    const likePost = async () => {
        await updateDoc(doc(db, 'users', auth.currentUser!.uid), {
            likedPosts: arrayUnion(post.id)
        });
    }

    const unlikePost = async () => {
        await updateDoc(doc(db, 'users', auth.currentUser!.uid), {
            likedPosts: arrayRemove(post.id)
        });
    }

    return (
        <div className="flex flex-col border-2 border-purple-100 rounded-md p-8 my-8 hover:border-purple-600 relative">
            <img
                alt=""
                src={post.imageUrl}
                className="self-center max-h-96 max-v-96"
            />
            <div className="h-px bg-purple-100 my-4" />
            <p>
                {post.caption}
            </p>
            <div className="flex items-center my-4">
                {
                    isLiked ?
                        <button
                            onClick={unlikePost}
                            className="bg-purple-900 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">
                            Beğendin
                        </button> : <button
                            onClick={likePost}
                            className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
                            Beğen
                        </button>

                }
                <div className="w-4" />
                <p>
                    {likeCount} Beğeni
                </p>
            </div>
        </div>
    );

}