import { Slot, Stack } from 'expo-router'
import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Colors } from "../constants/Colors"
import { StatusBar } from 'expo-status-bar'
import { UserProvider } from '../contexts/UserContext'
import { MusicNoteProvider } from '../contexts/MusicNoteContext'

const RootLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light 
  
    return (
        <UserProvider>
            <MusicNoteProvider>
        <StatusBar value="auto" />
        <Stack screenOptions={{
            headerStyle: { backgroundColor: theme.navBackground },
            headerTintColor: theme.text,
        }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false}} />
       
          <Stack.Screen name="(dashboard)" options={{ headerShown: false}} />
       
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false}} />
        </Stack>
           </MusicNoteProvider>
        </UserProvider>
    )
}

export default RootLayout

const styles = StyleSheet.create({})