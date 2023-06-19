'use client';

import { auth, db } from "@/app/firebase_config";
import { collection, doc, DocumentData, onSnapshot, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavigationBar from "../components/navigation_bar";
import PostList from "../components/post_list";

export default function MinePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<DocumentData>();
    const [posts, setPosts] = useState<DocumentData[]>([]);


    const router = useRouter();

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            console.log(`Auth state changed : ${user}`);
            if (!user) {
                router.push("/login");
            } else {
                subscribeToUser(user.uid);
                subscribeToPosts();
            }
        });
    }, []);


    useEffect(() => {
        if (user && posts) {
            setIsLoading(false);
        }
    }, [user, posts]);


    const subscribeToUser = async (userId: string) => {
        const unsub = onSnapshot(doc(db, 'users', userId), (querySnapshot) => {
            setUser(querySnapshot.data());
        });
    }

    const subscribeToPosts = async () => {

        const unsub = onSnapshot(query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc')
        ), (querySnapshot) => {
            let allPosts: DocumentData[] = [];

            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data.id = doc.id;

                allPosts.push(data);
            });

            setPosts(allPosts);
        });
    }




    return (
        <main>
            <div className="flex flex-col items-stretch"
            >
                {
                    isLoading ? <p>Loading...</p> : <>
                        <NavigationBar user={user} />
                        <div className="my-8 flex flex-col items-center">
                            <div className="max-w-2xl w-full">

                                <h1 className="font-bold text-xl">Paylaştıklarım</h1>
                                {
                                    posts.filter((post) => post.userId == auth.currentUser!.uid).length == 0 ? <p>Henüz hiçbir şey paylaşmadınız.</p> : null
                                }
                                <PostList
                                    posts={posts.filter((post) => post.userId == auth.currentUser!.uid)}
                                    user={user!}
                                    canBeDeleted={true}
                                />
                            </div>
                        </div>
                    </>
                }

            </div>
        </main >
    )
}