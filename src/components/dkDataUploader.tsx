'use client'

import { Blog } from "@/app/page";
import Loader from "@/components/Loader"
import { db, findAll, storage } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { StorageReference, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { useState, useEffect } from 'react'


export default function DkUploader(props: { blog: any; }) {
    const { blog } = props
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [loading2, setLoading2] = useState(true);
    const [progresspercent2, setProgresspercent2] = useState(0);
    const [imgUrl2, setImgUrl2] = useState();

    const direktorUpload = (e: any, fileUrl: string) => {
        e.preventDefault()
    
        const storageRef2 = ref(storage, 'files');
        //console.log('storage:', storageRef2)
    
        const file = e.target?.files[0]
        //console.log('file:', e.target?.files[0])
        if (!file) return;
    
        // const photoRef = storage.getInstance().getReferenceFromUrl(contentDTOs[p1].imageUrl.toString())
        // photoRef.delete()
    
        const storageRef = ref(storage, `files/${'direktor.jpg'}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        console.log("storageRef:",storageRef)
        uploadTask.on("state_changed",
          (snapshot) => {
            const progress =
              Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log(progress)
            setProgresspercent2(progress);
            setLoading2(true)
          },
          (error) => {
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              //@ts-ignore 
              setImgUrl2(downloadURL)
              setLoading2(false)
              // console.log(downloadURL)
            });
          }
        );
      }
      const onSubmit = async (event: Event | undefined, blog: Blog) => {
        let currentDate = new Date().toLocaleDateString()
         //console.log('blog:',blog)
        event?.preventDefault();
        await setDoc(doc(db, "blogs", 'dk_data'), {
          name: name,
          message: text,
          imageUrl: imgUrl2 || blog.imageUrl,
          date: currentDate
        });
    
        console.log({
          name: name,
          message: text,
          imageUrl: imgUrl2 || blog.imageUrl,
          date: currentDate
        })
        alert('yangi ozgarishlarni korish uchun saxifani yangilang!')
      }
    return(
        <>
        <div className=" w-32 p-10">
      <p className=" p-1">direktor</p>
          <input onChange={() => direktorUpload(event, blog.imageUrl)} type="file"/>
          {
                    !imgUrl2 &&
                    <div className='outerbar'>
                         <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
                <div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500 " style={{ width: progresspercent2 + "%" }}>{progresspercent2}%</div>
                    </div>
                    </div>

                }

            <input className=" text-black" value={name} onChange={e => setName(e.target.value)} type='text' placeholder="name" />
              <input className=" text-black" value={text} onChange={e => setText(e.target.value)} type='text' placeholder="Text" />
              <button  onClick={() => onSubmit(event, blog)} type='submit'>Upload</button>      
         
      </div>
        </>
    )
}