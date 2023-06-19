import { collection, DocumentData, updateDoc, doc, arrayUnion, arrayRemove, where, query, getDocs } from "firebase/firestore";
import { auth, db } from "@/app/firebase_config";
import React, { useEffect, useState } from "react";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";



export default function PostCard({ post, isLiked, user }: { user: DocumentData, post: DocumentData, isLiked: boolean }) {

    const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState(0);
    const [comment, setComment] = useState("");

    const [isOnLikeHover, setIsOnLikeHover] = useState<boolean>(false);

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
        <div className="flex flex-col border-2 border-purple-100 rounded-md p-8 my-8 hover:border-purple-600">
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
                <button className="border-2 hover:border-purple-600 rounded-lg flex justify-end items-center p-4 w-20 h-12 relative "
                    onMouseEnter={() => setIsOnLikeHover(true)}
                    onMouseLeave={() => setIsOnLikeHover(false)}
                    onClick={() => {
                        if (isLiked) {
                            unlikePost();
                        } else {
                            likePost();
                        }
                    }}
                >
                    {
                        isLiked ?
                            <div
                                className="text-purple-600 rounded-lg text-2xl absolute right-10 top-0">
                                {isOnLikeHover ? <LikeOutlined /> : <LikeFilled />}
                            </div> : <div
                                className="text-purple-600 rounded-lg text-2xl absolute right-10 top-0">
                                {isOnLikeHover ? <LikeFilled /> : <LikeOutlined />}
                            </div>

                    }
                    <div className="w-4" />
                    <p className="font-bold">
                        {likeCount}
                    </p>
                </button>
                <div className="flex-grow"></div>
                <button
                    onClick={() => {
                        if (isCommentsOpen) {
                            setIsCommentsOpen(false);
                        } else {
                            setIsCommentsOpen(true);
                        }
                    }}
                    className="text-purple-600 hover:text-purple-700 font-bold py-2 px-4 rounded">
                    {
                        isCommentsOpen ? "Yorumları Gizle" : "Yorumlar"
                    }
                </button>
            </div>
            {
                isCommentsOpen ?
                    <>
                        {
                            post.comments.map((comment: DocumentData) => {
                                return (
                                    <div
                                        key={comment.comment}
                                        className="flex flex-col my-4 border-2 p-4 rounded-lg">
                                        <p className="font-bold">
                                            {comment.userName}
                                        </p>
                                        <p>
                                            {comment.comment}
                                        </p>
                                    </div>
                                );
                            })
                        }
                        <form onSubmit={commentPost}>
                            <div className="bg-gray-50 border-2 border-purple-600 rounded-md p-8 flex flex-col">
                                <textarea className="my-4 p-4 border-2 focus:border-purple-600 outline-none" placeholder="Bir şeyler yaz..." onChange={onCommentChange} value={comment} />
                                <button type="submit" className="bg-purple-600 p-4 hover:bg-purple-500 text-white font-bold ">Yorum yap</button>
                            </div>
                        </form >
                    </>
                    : null
            }
        </div>
    );

}