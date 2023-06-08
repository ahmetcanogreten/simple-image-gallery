import React from "react"

import { Upload, Button, UploadProps, UploadFile } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import { useState } from "react";
import { v4 } from "uuid";


import { addDoc, collection, DocumentData } from "firebase/firestore";
import { auth, db, storage } from "@/app/firebase_config";

import { uploadBytes, ref, getDownloadURL } from "firebase/storage";



export default function ShareImageCard({
    user
}: {
    user: DocumentData
}) {

    const [imageList, setImageList] = useState<UploadFile[]>([]);
    const [caption, setCaption] = useState("");
    const [imageKey, setImageKey] = useState(v4());

    const uploadPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (imageList.length > 0) {
            const imageRef = ref(storage, v4());

            await uploadBytes(imageRef, imageList[0].originFileObj!);

            const downloadUrl = await getDownloadURL(imageRef);

            await addDoc(collection(db, 'posts'), {
                caption: caption,
                imageUrl: downloadUrl,
                createdAt: new Date(),
                userId: auth.currentUser?.uid,
                comments: []
            });

            setCaption("");
            setImageList([]);
            setImageKey(v4());

        }

    }

    const onFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (newFileList.length > 1) {
            newFileList.shift();
        }
        setImageList(newFileList);
    }

    const onCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCaption(e.target.value);

    }

    return (
        <form onSubmit={uploadPost}>
            <div className="bg-gray-50 border-2 border-purple-600 rounded-md p-8 flex flex-col">
                <h1 className="font-bold self-center">Hoş geldin {user.name}</h1>

                <h1 className="font-bold self-center">Sevdiklerinle Bir Anını Paylaş!</h1>
                <Upload key={imageKey} listType="picture" accept="image/*" multiple={false} onChange={onFileChange} beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Fotoğraf Seç</Button>
                </Upload>
                <textarea className="my-4 p-4 border-2 focus:border-purple-600 outline-none" placeholder="Bir şeyler yaz..." onChange={onCaptionChange} value={caption} />

                <button type="submit" className="bg-purple-600 p-4 hover:bg-purple-500 text-white font-bold ">Paylaş</button>
            </div>
        </form >

    )
}