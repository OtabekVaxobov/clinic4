"use client"
import { getStorage, ref, listAll } from "firebase/storage";
import { storage } from '../lib/firebase';
import { useState } from "react";

export const Images1 = () => {
    const [Images, setImages] = useState()

    // Create a reference under which you want to list
    const listRef = ref(storage, 'files/');

    // Find all the prefixes and items.
    listAll(listRef)
        .then((res) => {
            console.log(res);
            res.items.forEach((itemRef) => {
                // All the items under listRef.
                //@ts-ignore 
                itemRef.getDownloadURL().then((url) => {
                    //@ts-ignore 
                    setImages((allImages) => [...allImages, url]);
                    console.log(Images)
                })
            });
        }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log(error)
        });
    return (
        <>
            {Images}
        </>
    )
}
