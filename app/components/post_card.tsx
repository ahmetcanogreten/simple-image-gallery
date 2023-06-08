import { collection, DocumentData, updateDoc, doc, arrayUnion, arrayRemove, where, query, getDocs } from "firebase/firestore";
import { auth, db } from "@/app/firebase_config";
import React, { useEffect, useState } from "react";



export default function PostCard({ post, isLiked, user }: { user: DocumentData, post: DocumentData, isLiked: boolean }) {

    const [likeCount, setLikeCount] = useState(0);

    const [comment, setComment] = useState("");

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

    const commentPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await updateDoc(doc(db, 'posts', post.id), {
            comments: arrayUnion({
                userName: user.name,
                comment: comment
            })
        });
        setComment("");
    }

    const onCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
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
            {post.comments.map((comment: DocumentData) => {
                return (
                    <div
                        key={comment.comment}
                        className="flex flex-col my-4 border-2 p-4">
                        <p className="font-bold">
                            {comment.userName}
                        </p>
                        <p>
                            {comment.comment}
                        </p>
                    </div>
                );
            })}
            <form onSubmit={commentPost}>
                <div className="bg-gray-50 border-2 border-purple-600 rounded-md p-8 flex flex-col">
                    <textarea className="my-4 p-4 border-2 focus:border-purple-600 outline-none" placeholder="Bir şeyler yaz..." onChange={onCommentChange} value={comment} />
                    <button type="submit" className="bg-purple-600 p-4 hover:bg-purple-500 text-white font-bold ">Yorum yap</button>
                </div>
            </form >

        </div>
    );

}