'use client';

import PostList from "./components/post_list";
import ShareImageCard from "./components/share_image_card";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { auth } from "@/app/firebase_config";

import { collection, DocumentData, getDoc, onSnapshot, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/app/firebase_config";


export default function Home() {

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
    <main className="flex justify-center relative">
      <div className="absolute right-8 top-8">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"

          onClick={
            async (e) => {
              e.preventDefault();
              await auth.signOut();

            }
          }>
          Çıkış Yap
        </button>
      </div>
      <div className="w-screen max-w-4xl m-12"
      >
        {
          isLoading ? <p>Loading...</p> : <>

            <ShareImageCard
              user={user!}
            />
            <div className="h-10"></div>
            <PostList
              posts={posts}
              user={user!}
            />
          </>
        }

      </div>
    </main >
  )
}


