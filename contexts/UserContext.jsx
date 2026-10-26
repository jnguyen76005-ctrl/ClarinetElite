// Context = shared information that components udnerneath it can access 
import { createContext, useEffect, useState } from 'react'
import { account } from '../lib/appwrite'
import { ID } from 'react-native-appwrite'


// createContext() is a context object

//but it is basically a function with properties: Provider: and Consumer:
// createContext() creates a channel, not the actual user
export const UserContext = createContext()

//explain this in them most teachable and detailed way possible for someone who is learnign React Native and Appwrite for the first time and is a new coder. 
// is just a Reach component whose job is to hold authentication state/functions


export function UserProvider( { children } ) {
    const [user, setUser] = useState(null)
    const [authChecked, setAuthChecked] = useState(false)

    async function login(email, password) {
       try {
            await account.createEmailPasswordSession({email, password})
            const response = await account.get() 
            setUser(response)
        } catch (error){
            throw Error (error.message)
        }
    }
// number 24 resumed tmrw
     async function register(email, password) {
        try {
            await account.create({userId: ID.unique(), email, password})
            await login(email, password)
        } catch (error){
            throw Error (error.message)
        }
    }

     async function logout() {
        await account.deleteSession('current')
        setUser(null)
    }

    async function getInitialUserValue() {
        try {
            const response = await account.get()
            setUser(response)
        } catch (error){
            setUser(null)
        } finally {
            // I dont care whether it worked or failed. Do this afterward. 
            setAuthChecked(true)
        }
    }

    useEffect(() =>  {
       getInitialUserValue()
    }, [])

    // value = {{ users, login, register, logout }} is the onject being shared with those children
    return (
        <UserContext.Provider value={{ user, login, register, logout, authChecked, name: user?.name, email: user?.email }}>
            {children}
        </UserContext.Provider>
    )
}