'use client'

import ImageUploader from "@/components/ImageUploader"
import Loader from "@/components/Loader"
import DkUploader from "@/components/dkDataUploader";
import { db, findAll, storage } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { StorageReference, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';



export interface Blog {
  date: string,
  id: string,
  imageUrl: string,
  massage: string,
  name: string,
  uuid: string
}

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
  const [currentBlogData, setCurrentBlogData] = useState<Blog>()

  const [loading2, setLoading2] = useState(true);
  const [progresspercent2, setProgresspercent2] = useState(0);
  const [imgUrl2, setImgUrl2] = useState();

  const handleSubmit = (e: any, fileUrl: string) => {
    e.preventDefault()

    const storageRef2 = ref(storage, 'files');
    //console.log('storage:', storageRef2)

    const file = e.target?.files[0]
    //console.log('file:', e.target?.files[0])
    if (!file) return;

    // const photoRef = storage.getInstance().getReferenceFromUrl(contentDTOs[p1].imageUrl.toString())
    // photoRef.delete()

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
  // const direktorUpload = (e: any, fileUrl: string) => {
  //   e.preventDefault()

  //   const storageRef2 = ref(storage, 'files');
  //   //console.log('storage:', storageRef2)

  //   const file = e.target?.files[0]
  //   //console.log('file:', e.target?.files[0])
  //   if (!file) return;

  //   // const photoRef = storage.getInstance().getReferenceFromUrl(contentDTOs[p1].imageUrl.toString())
  //   // photoRef.delete()

  //   const storageRef = ref(storage, `files/${'direktor.jpg'}`);
  //   const uploadTask = uploadBytesResumable(storageRef, file);
  //   console.log("storageRef:",storageRef)
  //   uploadTask.on("state_changed",
  //     (snapshot) => {
  //       const progress =
  //         Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
  //       console.log(progress)
  //       setProgresspercent2(progress);
  //       setLoading2(true)
  //     },
  //     (error) => {
  //       alert(error);
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         //@ts-ignore 
  //         setImgUrl2(downloadURL)
  //         setLoading2(false)
  //         // console.log(downloadURL)
  //       });
  //     }
  //   );
  // }
  const handleClick = (blog: Blog) => {
    // 👇️ toggle shown state
    setIsShown(current => !current);
    setCurrentBlogData(blog)

    console.log(blog)
  };

  const onSubmit = async (event: Event | undefined, blog: Blog) => {
    let currentDate = new Date().toJSON().slice(0, 10);
     //console.log('blog:',blog)
    event?.preventDefault();
    await setDoc(doc(db, "blogs", blog.id), {
      uuid: blog.id,
      name: name,
      message: text,
      imageUrl: imgUrl || blog.imageUrl,
      date: currentDate
    });

    // console.log({
    //   id: blog.id,
    //   uuid: blog.uuid,
    //   name: name,
    //   message: text,
    //   imageUrl: imgUrl || blog.imageUrl,
    //   date: currentDate
    // })
    alert('yangi ozgarishlarni korish uchun saxifani yangilang!')
  }

  const { blog } = props
  // console.log(blog)
  return (
    <li className="flex flex-col justify-center p-4 content-center  mx-8">
      <DkUploader blog={blog}/>
      {blog.imageUrl ?
        <div className="border-red-800 border-4">
          <Image loading="lazy" src={blog.imageUrl} width={300} height={300} alt="img" />
          <p>name: {blog.name}</p>
          <p>Continent: {blog.message}</p>
          <button className="rounded-md border-2 border-gray-700 hover:bg-gray-300 p-2" onClick={() => handleClick(blog)}>change</button>
          {isShown && (
            <div className='flex flex-col justify-center'>
              <input onChange={() => handleSubmit(event, blog.imageUrl)} type='file' />
              <input className=" text-black" value={name} onChange={e => setName(e.target.value)} type='text' placeholder="name" />
              <input className=" text-black" value={text} onChange={e => setText(e.target.value)} type='text' placeholder="Text" />
              <button  onClick={() => onSubmit(event, blog)} type='submit'>Upload</button>
              {
                    !imgUrl &&
                    <div className='outerbar'>
                         <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
                <div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500 " style={{ width: progresspercent + "%" }}>{progresspercent}%</div>
                    </div>
                    </div>

                }
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