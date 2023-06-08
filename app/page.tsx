'use client';

import PostList from "./components/post_list";
import ShareImageCard from "./components/share_image_card";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { auth } from "@/app/firebase_config";

import { collection, DocumentData, getDoc, onSnapshot, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/app/firebase_config";

import { Avatar } from "antd";


export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<DocumentData>();
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

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
    <main className="flex justify-center relative">
      {
        isLoading ? null :
          <div className="absolute right-16 top-8">

            <div className="flex flex-col items-center" onMouseLeave={() => setIsProfileModalOpen(false)}>
              <div onMouseEnter={() => setIsProfileModalOpen(true)}>
                <Avatar className="bg-purple-700 w-16 h-16 flex flex-col justify-center">
                  <p className="font-bold text-2xl">
                    {user?.name[0]}
                  </p>
                </Avatar>
              </div>

              <div className={`my-4 rounded-lg bg-purple-500 p-4 ${isProfileModalOpen ? "" : "opacity-0"} w-48`}>
                <p className="text-white font-bold my-4">
                  {user?.name}
                </p>
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

            </div>

          </div>}
      <div className="w-screen max-w-4xl m-12"
      >
        {
          isLoading ? <p>Loading...</p> : <>

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

          </>
        }

      </div>
    </main >
  )
}


