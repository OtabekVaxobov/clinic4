"use client"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useState } from 'react';
import { db, storage } from '../lib/firebase';
import firebase from "firebase/compat/app";
import { doc, setDoc } from "firebase/firestore";

// Add a new document in collection "cities"


export default function ImageUploader() {

    const [imgUrl, setImgUrl] = useState();
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [text, setText] = useState('');
    const [progresspercent, setProgresspercent] = useState(0);
    const [loading, setLoading] = useState(true);


    const onSubmit = async (event: any) => {
        event.preventDefault();


        await setDoc(doc(db, "blogs", "LA"), {
            name: name,
            message: text,
            imageUrl: imgUrl,
        });

        console.log({
            name: name,
            message: text,
            imageUrl: imgUrl,
        })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const file = e.target?.files[0]
        console.log('file:', e.target?.files[0])
        if (!file) return;

        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(progress)
                setProgresspercent(progress);
                setLoading(true)
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //@ts-ignore 
                    setImgUrl(downloadURL)
                    setLoading(false)
                    console.log(downloadURL)

                });
            }
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex">
                {/* <form onSubmit={handleSubmit} className='flex flex-col justify-center'>
                    <input onChange={handleSubmit} type='file' />
                </form> */}
                <div className='flex flex-col justify-center'>
                    <input onChange={handleSubmit} type='file' />
                    <input value={name} onChange={e => setName(e.target.value)} type='text' placeholder="name" />
                    <input value={text} onChange={e => setText(e.target.value)} type='text' placeholder="Text" />
                    <button hidden={loading} onClick={onSubmit} type='submit'>Upload</button>

                </div>
                {
                    !imgUrl &&
                    <div className='outerbar'>
                        {/* <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div> */}
                        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-600">
                            <div className="h-1 bg-primary" style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                        </div>
                    </div>

                }
                {
                    imgUrl &&
                    <>
                        {/* <img src={imgUrl} alt='uploaded file' height={200} /> */}
                        {/* {imgUrl} <br /> */}
                        {name} <br /> {text}
                    </>

                }
            </div>
        </main>
    )
}



