'use client';

import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import { updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavigationBar from "../components/navigation_bar";
import { auth, db } from "../firebase_config";

export default function ChangePasswordPage() {

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<DocumentData>();

    const router = useRouter();

    const subscribeToUser = async (userId: string) => {
        const unsub = onSnapshot(doc(db, 'users', userId), (querySnapshot) => {
            setUser(querySnapshot.data());
        });
    }

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            console.log(`Auth state changed : ${user}`);
            if (!user) {
                router.push("/login");
            } else {
                subscribeToUser(user.uid);
                setIsLoading(false);
            }
        });
    }, []);

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsError(false);
        setIsSuccess(false);

        try {
            await signInWithEmailAndPassword(auth, auth.currentUser!.email!, oldPassword);
            await updatePassword(auth.currentUser!, password);

            setIsSuccess(true);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }

    }

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const onOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOldPassword(e.target.value);
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
                                <h1 className="font-bold text-xl">Şifreyi Sıfırla</h1>
                                <form onSubmit={handleReset}>
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="flex flex-col max-w-md w-10/12">
                                            <img
                                                className="max-w-4xl p-4"
                                                src="/forgot-password/forgot_password.svg"
                                                alt="Login"
                                            />
                                            <label htmlFor="password" className="text-black font-bold">
                                                Eski Şifre
                                            </label>
                                            <input
                                                id="password" type="password" placeholder="Eski Şifre"
                                                required
                                                className="my-4 p-4 border-2 focus:border-purple-600 outline-none"
                                                onChange={onOldPasswordChange} />
                                            <label htmlFor="password" className="text-black font-bold">
                                                Yeni Şifre
                                            </label>
                                            <input
                                                id="password" type="password" placeholder="Yeni Şifre"
                                                required
                                                className="my-4 p-4 border-2 focus:border-purple-600 outline-none"
                                                onChange={onPasswordChange} />
                                            {isSuccess && <p className="text-green-500">Şifre başarıyla değiştirildi.</p>}
                                            {isError && <p className="text-red-500">Şifre değiştirilirken bir hata oluştu.</p>}
                                            <button type="submit" className="text-white my-8 p-4 bg-purple-600 hover:bg-purple-500">Şifreyi Değiştir</button>
                                        </div>
                                    </div>
                                </form>


                            </div>
                        </div>
                    </>
                }
            </div>
        </main>
    )
}