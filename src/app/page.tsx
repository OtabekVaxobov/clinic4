'use client'

import ImageUploader from "@/components/ImageUploader"
import Loader from "@/components/Loader"
import { db, findAll, storage } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';

export default function Home() {


  return (
    <main className="flex  min-h-screen flex-col items-center justify-center">
      <ImageUploader />
      <button className="rounded-md border-2 border-gray-700 hover:bg-gray-300 p-2" onClick={() => findAll()}>get all blogs</button>
      <BlogList />
    </main>
  )
}


function BlogListItem(props: { blog: any; }) {
  const [isShown, setIsShown] = useState(false);

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
      uuid: randomNumber,
      name: name,
      message: text,
      imageUrl: imgUrl,
      date: currentDate
    });

    console.log({
      uuid: randomNumber,
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

  const handleClick = (blog: any) => {
    // 👇️ toggle shown state
    setIsShown(current => !current);
    console.log(blog)
  };
  const { blog } = props
  // console.log(blog)
  return (
    <li className="flex flex-col justify-center content-center">
      {blog.imageUrl ?
        <div>
          <Image loading="lazy" src={blog.imageUrl} width={300} height={300} alt="img" />
          <p>name: {blog.name}</p>
          <p>Continent: {blog.message}</p>
          <button className="rounded-md border-2 border-gray-700 hover:bg-gray-300 p-2" onClick={() => handleClick(blog)}>change</button>
          {isShown && (
            <div className='flex flex-col justify-center'>
              <input onChange={handleSubmit} type='file' />
              <input value={name} onChange={e => setName(e.target.value)} type='text' placeholder="name" />
              <input value={text} onChange={e => setText(e.target.value)} type='text' placeholder="Text" />
              <button hidden={loading} onClick={onSubmit} type='submit'>Upload</button>

            </div>
          )}

          {/* 👇️ show component on click */}
          {/* {isShown && <>texrt</>} */}
        </div> :
        <Loader />
      }
    </li>
  )
}


function BlogList() {
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState([{}])

  const fetchData = async () => {
    setLoading(true)

    const res = await findAll()

    setCountries([...res])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <section className="flex flex-col justify-center items-center">
      <header>
        <p>Blogs</p>
      </header>

      {loading &&
        <p>loading...</p>
      }

      <ul>
        {countries.length > 0 && countries.map((blog, id) => (

          <BlogListItem key={id} blog={blog} />
        ))}
      </ul>
    </section>
  )
}