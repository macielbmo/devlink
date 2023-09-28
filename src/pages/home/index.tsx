import { useState, useEffect } from 'react'

import {FaFacebook, FaInstagram, FaYoutube} from 'react-icons/fa'

import { db } from "../../services/firebaseConnection"
import { getDocs, collection, orderBy, query, doc, getDoc } from 'firebase/firestore'

import Social from "../../components/Social";

interface LinkProps {
  id: string,
  name: string,
  url: string,
  bg: string,
  color: string,
}

interface SocialProps {
  facebook: string,
  instagram: string,
  youtube: string,
}

export default function Home() {
  const [links, setLinks] = useState<LinkProps[]>([])
  const [social, setSocial] = useState<SocialProps>()

  useEffect(() => {
    function loadLinks() {
      const linksRef = collection(db, "links")
      const queryRef = query(linksRef, orderBy('created', 'asc'))
      
      getDocs(queryRef)
      .then((snapshot) => {
        const lista = [] as LinkProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            name: doc.data().name,
            url: doc.data().url,
            bg: doc.data().bg,
            color: doc.data().color
          })
        })

        setLinks(lista);
      })
    }

    loadLinks()
  }, [])

  useEffect(() => {
    function loadSocial() {
      const docRef = doc(db, "social", "link")
      
      getDoc(docRef)
      .then((snapshot) => {
        if(snapshot.data() !== undefined) {
          setSocial({
            facebook: snapshot.data()?.facebook,
            instagram: snapshot.data()?.instagram,
            youtube: snapshot.data()?.youtube
          })
        }
      })
    }

    loadSocial();
  }, [])

  return(
    <div className="flex flex-col w-full h-screen py-4 items-center">
      <h1 className="md:text-4xl text-3xl font-bold text-white mt-20" >Maciel Martins</h1>
      <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        
        {links.map((link) => (
          <section
            key={link.id}
            style={{ backgroundColor: link.bg, color: link.color }}
            className="mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer font-medium">
          <a href={link.url} target='_blank'>
            <p className="md:text-lg text-base">{link.name}</p>
          </a>
        </section>
        ))}

        {social && Object.keys(social).length > 0 && (
          <footer className="flex justify-center gap-3 my-4">
            {social?.facebook !== "" && (
              <Social url={social?.facebook}>
                <FaFacebook size={35} color="#FFF"/>
              </Social>
            )}

            {social?.instagram !== "" && (
              <Social url={social?.instagram}>
                <FaInstagram size={35} color="#FFF"/>
              </Social>
            )}

            {social?.youtube !== "" && (
              <Social url={social?.youtube}>
                <FaYoutube size={35} color="#FFF"/>
              </Social>
            )}
        </footer>
        )}
      </main>
    </div>
  )
}