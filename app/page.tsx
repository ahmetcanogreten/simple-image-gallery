'use client';

import PostList from "./components/post_list";
import ShareImageCard from "./components/share_image_card";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { auth } from "@/app/firebase_config";

import { collection, DocumentData, getDoc, onSnapshot, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/app/firebase_config";

import NavigationBar from "./components/navigation_bar";


export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<DocumentData>();
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");


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

  const toAllPosts = () => {
    setActiveTab("all");
  }

  const toMyPosts = () => {
    setActiveTab("mine");
  }

  const toLikedPosts = () => {
    setActiveTab("liked");
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
                <ShareImageCard
                  user={user!}
                />
                <div className="h-10"></div>
                <div className="flex justify-between">
                  <button
                    onClick={toAllPosts}
                    className={
                      `${activeTab == "all" ? "bg-purple-700" : "bg-purple-400"}
                  hover:bg-purple-500 text-white p-4 rounded-md w-1/4`
                    }
                  >
                    Hepsi
                  </button>
                  <button
                    onClick={toMyPosts}
                    className={
                      `${activeTab == "mine" ? "bg-purple-700" : "bg-purple-400"}
                hover:bg-purple-500 text-white p-4 rounded-md w-1/4`
                    }
                  >
                    Benim Paylaştıklarım
                  </button>
                  <button
                    onClick={toLikedPosts}
                    className={
                      `${activeTab == "liked" ? "bg-purple-700" : "bg-purple-400"}
                hover:bg-purple-500 text-white p-4 rounded-md w-1/4`
                    }
                  >
                    Beğendiklerim
                  </button>
                </div>
                {
                  activeTab == "all" ?
                    <PostList
                      posts={posts}
                      user={user!}
                    /> : (
                      activeTab == "mine" ?
                        <PostList
                          posts={posts.filter((post) => post.userId == auth.currentUser!.uid)}
                          user={user!}
                        /> : <PostList
                          posts={posts.filter((post) => user!.likedPosts.includes(post.id))}
                          user={user!}
                        />)
                }

              </div>
            </div>
          </>
        }

      </div>
    </main >
  )
}


