import React from "react"

import { useState } from "react";
import { v4 } from "uuid";


import { addDoc, collection, DocumentData } from "firebase/firestore";
import { db, storage } from "@/app/firebase_config";

import { uploadBytes, ref, getDownloadURL } from "firebase/storage";



export default function ShareImageCard({
    user
}: {
    user: DocumentData
}) {

    const [image, setImage] = useState<File | null>(null);
    const [caption, setCaption] = useState("");
    const [imageKey, setImageKey] = useState(v4());

    const uploadPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (image) {
            const imageRef = ref(storage, v4());

            await uploadBytes(imageRef, image);

            const downloadUrl = await getDownloadURL(imageRef);

            await addDoc(collection(db, 'posts'), {
                caption: caption,
                imageUrl: downloadUrl,
                createdAt: new Date(),
                likes: 0,
            });

            setCaption("");
            setImage(null);
            setImageKey(v4());

        }


    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    }

    const onCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCaption(e.target.value);

    }

    return (
        <form onSubmit={uploadPost}>
            <div className="bg-gray-50 border-2 border-purple-600 rounded-md p-8 flex flex-col">
                <h1 className="font-bold self-center">Hoş geldin {user.name}</h1>

                <h1 className="font-bold self-center">Sevdiklerinle Bir Anını Paylaş!</h1>
                <div className="my-4">
                    <input
                        key={imageKey} id="file-chooser" type="file" className="" onChange={onFileChange} />
                </div>
                <textarea className="my-4 p-4 border-2 focus:border-purple-600 outline-none" placeholder="Bir şeyler yaz..." onChange={onCaptionChange} value={caption} />
                <button type="submit" className="bg-purple-600 p-4 hover:bg-purple-500 text-white font-bold ">Paylaş</button>
            </div>
        </form >

    )
}