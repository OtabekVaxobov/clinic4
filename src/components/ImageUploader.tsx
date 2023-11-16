"use client"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useState } from 'react';
import { db, storage } from '../lib/firebase';
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';                        // random number



export default function ImageUploader() {

    const [imgUrl, setImgUrl] = useState();
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [progresspercent, setProgresspercent] = useState(0);
    const [loading, setLoading] = useState(true);



    const onSubmit = async (event: any) => {
        let currentDate = new Date().toJSON().slice(0, 10);
        const randomNumber = uuidv4();
        event.preventDefault();
        await setDoc(doc(db, "blogs", randomNumber), {
            uiud: randomNumber,
            name: name,
            message: text,
            imageUrl: imgUrl,
            date: currentDate
        });

        console.log({
            uiud: randomNumber,
            name: name,
            message: text,
            imageUrl: imgUrl,
            date: currentDate
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
                    // console.log(downloadURL)
                });
            }
        );
    }

    return (
        <main className="flex flex-col items-center  p-24">
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

                    </div>

                }


            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
                <div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500 " style={{ width: progresspercent + "%" }}>{progresspercent}%</div>
            </div>
        </main>
    )
}



