import { Avatar } from "antd";
import { DocumentData } from "firebase/firestore";
import { useState } from "react";
import Link from "next/link";
import { auth } from "../firebase_config";
import { CameraFilled } from "@ant-design/icons";

export default function NavigationBar({
    user
}: {
    user: DocumentData | undefined
}) {

    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

    return (
        <nav >
            <div className="h-16 w-full flex items-center justify-between px-4 text-purple-600 cursor-pointer">

                <Link
                    className="text-2xl font-bold cursor-pointer flex items-center"
                    href={"/"}
                >
                    <CameraFilled />
                    <p className="inline mx-2">Gallery</p>

                </Link>
                <div className="relative" onMouseLeave={() => setIsProfileModalOpen(false)}>
                    <div className="flex items-center" onMouseEnter={() => setIsProfileModalOpen(true)}>
                        <Avatar className="bg-purple-700 w-12 h-12 flex flex-col justify-center">
                            <p className="font-bold text-xl">
                                {user?.name[0]}
                            </p>
                        </Avatar>
                    </div>

                    <div className="flex flex-col items-stretch absolute right-0"
                    >
                        <div className={`my-4 rounded-lg bg-purple-500 p-4 ${isProfileModalOpen ? "" : "hidden"} w-48`}>
                            <p className="text-white font-bold my-4 text-center">
                                {user?.name}
                            </p>
                            <div className="h-px bg-purple-600"></div>
                            <Link href={"/mine"} className="p-4 my-2 w-full text-start rounded-lg text-white hover:bg-white hover:text-purple-600 block">Paylaştıklarım</Link>
                            <Link href={"/liked"} className="p-4 my-2 w-full text-start rounded-lg text-white hover:bg-white hover:text-purple-600 block">Beğendiklerim</Link>
                            <Link href={"/change-password"} className="p-4 my-2 w-full text-start rounded-lg text-white hover:bg-white hover:text-purple-600 block">Şifre Değiştir</Link>

                            <button
                                className="p-4 my-2 w-full text-start rounded-lg text-white  bg-red-600 hover:bg-red-700 font-bold"

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
                </div>
            </div>

            <div className="h-px bg-purple-600">
            </div>
        </nav>
    )
}