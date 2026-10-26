import { StyleSheet, View, Text } from 'react-native'
import { useState, useEffect } from 'react'
import { useMusicNote } from '../../../hooks/useMusicNote'
import { Colors } from "../../../constants/Colors"
import { useRouter, useLocalSearchParams } from 'expo-router'

// themed components
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import ThemedCard from "../../../components/ThemedCard"
import Spacer from "../../../components/Spacer"
import ThemedButton from "../../../components/ThemedButton"
import ThemedLoader from "../../../components/ThemedLoader"

const MusicNoteDetails = () => {
  const [MusicNote, setMusicNote] = useState(null)

  const { id } = useLocalSearchParams()
  const { fetchMusicNoteById, deleteMusicNote } = useMusicNote()
  const router = useRouter()

  const handleDelete = async () => {
    await deleteMusicNote(id)
    setMusicNote(null)
    router.replace('/MusicNotes')
  }

  useEffect(() => {
    async function loadMusicNote() {
      const MusicNoteData = await fetchMusicNoteById(id)
      setMusicNote(MusicNoteData)
    }

    loadMusicNote()

    return () => setMusicNote(null)
  }, [id])

  if (!MusicNote) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  return (
    <ThemedView safe={true} style={styles.container}>
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.title}>{MusicNote.title}</ThemedText>
        <ThemedText>Written by {MusicNote.author}</ThemedText>
        <Spacer />

        <ThemedText title={true}>MusicNote description:</ThemedText>
        <Spacer height={10} />

        <ThemedText>{MusicNote.description}</ThemedText>
      </ThemedCard>

      <ThemedButton onPress={handleDelete} style={styles.delete}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Delete MusicNote</Text>
      </ThemedButton>
    </ThemedView>
  )
}

export default MusicNoteDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
  },
  card: {
    margin: 20
  },
  delete: {
    marginTop: 40,
    backgroundColor: Colors.warning,
    width: 200,
    alignSelf: "center",
  },
})