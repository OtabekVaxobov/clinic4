'use client'
import { Images1 } from "@/components/AllImages"
import ImageUploader from "@/components/ImageUploader"
import Loader from "@/components/Loader"
import { db, findAll } from "@/lib/firebase";
import Image from "next/image";
import { useState, useEffect } from 'react'

export default function Home() {
  return (
    <main className="flex  min-h-screen flex-col items-center justify-center">
      <ImageUploader />
      {/* <Images1 /> */}
      {/* <Loader show={true} /> */}
      <button className="rounded-md border-2 border-gray-700 hover:bg-gray-300 p-2" onClick={() => findAll()}>get all blogs</button>
      <BlogList />
    </main>
  )
}


function BlogListItem(props: { blog: any; }) {
  const { blog } = props
  // console.log(blog)
  return (
    <li className="flex flex-col justify-center content-center">
      {/* <h3>{blog.flag} {blog.name} ({blog.code})</h3> */}
      {blog.imageUrl ? <>
        <Image loading="lazy" src={blog.imageUrl} width={300} height={300} alt="img" />
        <p>name: {blog.name}</p>
        <p>Continent: {blog.message}</p>
      </> :
        <Loader />
      }
      {/* <Image loading="lazy" src={blog.imageUrl} width={300} height={300} alt="svg" /> */}

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