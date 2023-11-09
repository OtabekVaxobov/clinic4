import { Images1 } from "@/components/AllImages"
import ImageUploader from "@/components/ImageUploader"
import Loader from "@/components/Loader"

export default function Home() {



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ImageUploader />
      {/* <Images1 /> */}
      <Loader show={true} />
    </main>
  )
}

