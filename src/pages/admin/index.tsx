import { FormEvent, useState, useEffect } from 'react'
import { FiTrash } from 'react-icons/fi'

import { db } from "../../services/firebaseConnection"
import { addDoc, collection, onSnapshot, query, orderBy, doc, deleteDoc, Query } from 'firebase/firestore'

import Header from "../../components/Header";
import Input from "../../components/input";

interface LinkProps {
  id: string,
  name: string,
  url: string,
  bg: string,
  color: string,
}

export default function Admin() {
  const [nameInput, setNameInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [bgColorInput, setBgColorInput] = useState('#f1f1f1')
  const [textColorInput, setTextColorInput] = useState('#121212')

  const [links, setLinks] = useState<LinkProps[]>([])

  useEffect(() => {
    const linksRef = collection(db, "links")
    const queryRef = query(linksRef, orderBy("created", "asc"))
    
    const unsub = onSnapshot(queryRef, (snapshot) => {
      const list = [] as LinkProps[];

      snapshot.forEach((doc) => {
         list.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color,
         }) 
      })

      setLinks(list)
    })
    
    return () => unsub();

  }, [])

  async function hadleRegister(e: FormEvent) {
    e.preventDefault();

    if(nameInput === '' || urlInput === ''){
      alert('Preencha todos os campos!');
      return;
    }

    addDoc(collection(db, "links"), {
      name: nameInput,
      url: urlInput,
      bg: bgColorInput,
      color: textColorInput,
      created: new Date(),
    })
    .then(() => {
      setNameInput("")
      setUrlInput("")
      console.log("Cadastrado com sucesso!")
    })
    .catch((error) => {
      console.log("Erro ao cadastrar no banco! " + error)
    })

  }

  async function hadleDeletedLink(id: string) {
    const docRef = doc(db, "links", id)
    await deleteDoc(docRef)
  }

  return(
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header />

      <form className="flex flex-col mt-8 mb-3 w-full max-w-xl" onSubmit={hadleRegister}>
        <label className="text-white font-medium mt-2 mb-2" htmlFor="name">Nome do Link</label>
        <Input 
          type="string" 
          id="name" 
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Digite o nome do link"
          />

        <label className="text-white font-medium mt-2 mb-2" htmlFor="url">URL do Link</label>
        <Input 
          type="url" 
          id="url" 
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Digite o nome do link"
          />

          <section className='flex my-4 gap-5'>
            <div className='flex gap-2'>
              <label className="text-white font-medium mt-2 mb-2" htmlFor="name">Cor fundo do Link</label>
              <input 
                type="color"
                value={bgColorInput}
                onChange={(e) => setBgColorInput(e.target.value)}
                />
            </div>

            <div className='flex gap-2'>
              <label className="text-white font-medium mt-2 mb-2" htmlFor="name">Cor texto do Link</label>
              <input 
                type="color"
                value={textColorInput}
                onChange={(e) => setTextColorInput(e.target.value)}
                />
            </div>
          </section>

          {nameInput !== '' && (
            <div className='flex items-center justify-center flex-col mb-7 p-1 border-gray-100/25 border rounded-md'>
              <label className="text-white font-medium mt-2 mb-3" htmlFor="name">Como está ficando:</label>
              <article
                className='w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3'
                style={{marginBottom: 8, marginTop: 8, backgroundColor: bgColorInput}}
              >
                <p 
                className='font-bold'
                style={{color: textColorInput}}>{nameInput}</p>
              </article>
          </div>
          )}

          <button 
            type='submit' 
            className='mb-7 bg-blue-600 h-9 rounded text-white font-medium gap-4 flex items-center justify-center'>
            Cadastrar
          </button>
      </form>

      <section className='w-full flex flex-col items-center'>
        <h2 className='font-bold text-white mb-4 text-2xl'>Meus Links</h2>

        {links.map( (link) => (
          <article 
            key={link.id}
            className='flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none'
            style={{backgroundColor: `${link.bg}`, color: `${link.color}`}}
        >
          <p className='font-medium'>{link.name}</p>

          <div className='flex justify-center'>
            <button 
              onClick={() => hadleDeletedLink(link.id) }
              className='border border-dashed p-1 rounded bg-neutral-800'> 
              <FiTrash size={18} color='#FFF'/> </button>
          </div>
        </article>
        ))}
      </section>
    </div>
  )
}