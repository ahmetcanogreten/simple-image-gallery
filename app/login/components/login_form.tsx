'use client';
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { auth } from "@/app/firebase_config";
import { signInWithEmailAndPassword } from "firebase/auth";


export default function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let user = await signInWithEmailAndPassword(auth, email, password);

        if (user) {
            router.push("/");
        }
    }

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    return (
        <form onSubmit={handleLogin}>

            <div className="flex flex-col w-screen h-screen justify-center items-center">
                <div className="flex flex-col max-w-md w-10/12">

                    <label htmlFor="name" className="text-white font-bold">
                        E-Posta
                    </label>
                    <input
                        id="email" type="email" placeholder="E-Posta"
                        required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        className="my-4 p-4 border-2 focus:border-purple-600 outline-none"
                        onChange={onEmailChange} />
                    <label htmlFor="name" className="text-white font-bold">
                        Şifre
                    </label>
                    <input
                        id="password" type="password" placeholder="Şifre"
                        required
                        className="my-4 p-4 border-2 focus:border-purple-600 outline-none"
                        onChange={onPasswordChange} />
                    <button type="submit" className="text-white my-8 p-4 bg-purple-600 hover:bg-purple-500">Giriş</button>
                    <div className="flex justify-center">
                        <Link href="/register" className="text-purple-600 hover:text-purple-500 text-center p-4">Kaydol</Link>
                    </div>
                </div>
            </div>
        </form>
    )
}