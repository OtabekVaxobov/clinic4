"use client"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useState } from 'react';
import { storage } from '../lib/firebase';

export default function ImageUploader() {
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const file = e.target[0]?.files[0]

        if (!file) return;

        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        console.log(storageRef)
        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(progress)
                setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //@ts-ignore 
                    setImgUrl(downloadURL)
                    console.log(downloadURL)
                    console.log(storageRef)
                });
            }
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="App">
                <form onSubmit={handleSubmit} className='form'>
                    <input type='file' />
                    <button type='submit'>Upload</button>
                </form>
                {
                    !imgUrl &&
                    <div className='outerbar'>
                        <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                    </div>
                }
                {
                    imgUrl &&
                    <>
                        <img src={imgUrl} alt='uploaded file' height={200} />
                        {imgUrl}
                    </>

                }
            </div>
        </main>
    )
}