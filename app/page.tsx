'use client';

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { auth } from "@/app/firebase_config";


export default function Home() {

  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (!user) {
        router.push("/login");
      } else {
        setIsCheckingUser(false);
      }
    });
  }, []);



  return (
    <main>
      <h1>Home</h1>
    </main>
  )
}


