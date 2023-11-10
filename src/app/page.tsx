import { Images1 } from "@/components/AllImages"
import ImageUploader from "@/components/ImageUploader"
import Loader from "@/components/Loader"
import { db } from "@/lib/firebase";

export default function Home() {



  return (
    <main className="flex flex-col items-center">
      <ImageUploader />
      {/* <Images1 /> */}
      <Loader show={true} />
    </main>
  )
}

