import 'react-native-url-polyfill/auto'
import { Client, Account, Avatars, Databases } from "react-native-appwrite"

export const client = new Client()

client
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6a4444840004d3c8ec82')
  .setPlatform('dev.jayden.clarinet')

export const account = new Account(client)
export const avatars = new Avatars(client)
export const databases = new Databases(client)