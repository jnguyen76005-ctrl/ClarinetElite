import { createContext, useState, useEffect } from 'react'
import { databases, client } from '../lib/appwrite'
import { ID, Permission, Role, Query } from 'react-native-appwrite'
import { useUser } from '../hooks/useUser'



const DATABASE_ID = "6ab9fd530008641d2e3c" 
const COLLECTION_ID = "6ab9fd9f0029dd49ef80"

export const MusicNoteContext = createContext()

export function MusicNoteProvider({children}) {
  const [MusicNote, setMusicNote] = useState([])
  const { user } = useUser()

  async function fetchMusicNote() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID, 
        COLLECTION_ID,
        [
          Query.equal('userId', user.$id)
        ]
      )

      setMusicNote(response.documents)
      console.log(response.documents)
    } catch (error) {
      console.error(error.message)
    }
  }

  async function fetchMusicNoteById(id) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      )

      return response
    } catch (error) {
      console.log(error.message)
    }
  }

  async function createMusicNote(data) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {...data, userId: user.$id},
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      )
    } catch (error) {
      console.log(error.message)
    }
  }

  async function deleteMusicNote(id) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
      )
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    let unsubscribe
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`

    if (user) {
      fetchMusicNote()

      unsubscribe = client.subscribe(channel, (response) => {
        const { payload, events } = response
        console.log(events)

        if (events[0].includes("create")) {
          setMusicNote((prevMusicNote) => [...prevMusicNote, payload])
        }

        if (events[0].includes("delete")) {
          setMusicNote((prevMusicNote) => prevMusicNote.filter((MusicNote) => MusicNote.$id !== payload.$id))
        }
      })

    } else {
      setMusicNote([])
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }

  }, [user])

  return (
    <MusicNoteContext.Provider 
      value={{ MusicNote, fetchMusicNote, fetchMusicNoteById, createMusicNote, deleteMusicNote }}
    >
      {children}
    </MusicNoteContext.Provider>
  )
}