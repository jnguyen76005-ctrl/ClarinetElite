import { Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { useState } from 'react'
import { useUser } from '../../hooks/useUser'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import { Colors } from '../../constants/Colors'

const Profile = () => {
  const { logout, user } = useUser()
  const [aboutVisible, setAboutVisible] = useState(false)
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  // Come back and review and look over 

  return (
    <ThemedView style={styles.container}>

      <ThemedText title={true} style={styles.heading}>
        Welcome, {user.name}!
      </ThemedText>
      <Spacer />

      <ThemedText>Time to make TMEA All-State...</ThemedText>
      <Spacer />

      <ThemedButton onPress={() => setAboutVisible(true)} accessibilityRole="button">
        <Text style={styles.aboutButtonText}>About this Beta App</Text>
      </ThemedButton>
      <Spacer />

      <ThemedButton onPress={logout} style={styles.button}>
        <Text style={{ color: '#f2f2f2' }}>Logout</Text>
      </ThemedButton>


      <Modal
        animationType="fade"
        transparent={true}
        visible={aboutVisible}
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close about dialog"
            style={styles.backdrop}
            onPress={() => setAboutVisible(false)}
          />
          <View style={[styles.modalCard, { backgroundColor: theme.uiBackground }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close about dialog"
              onPress={() => setAboutVisible(false)}
              style={styles.closeButton}
            >
              <Text style={[styles.closeText, { color: theme.title }]}>×</Text>
            </Pressable>
            <ThemedText title style={styles.modalTitle}>About this beta app</ThemedText>
            <ThemedText style={styles.modalMessage}>
              HI, this is Jayden Nguyen here! This is a Clarinet app that I've been working on since Summer, but it's a work in progress. Learning react/expo from scratch sure does take time 😮‍💨 Anyways... Much love to everyone who is seeing this message. It means a lot. Thanks for downloading this app of mines ❤️ 
            </ThemedText>

            <Spacer height={5} />

            <ThemedText title={true} style={styles.modalMessage}>
              App Features So Far!
            </ThemedText>

            <Spacer height={5} />

            <ThemedText style={styles.modalMessage}>
            • A Notes Feature For Music
            </ThemedText>

            <Spacer height={5} />

            <ThemedText style={styles.modalMessage}>
             • A Tuner
            </ThemedText>

            <Spacer height={5} />

            <ThemedText style={styles.modalMessage}>
            • A Metranome
            </ThemedText>
          </View>
        </View>
      </Modal>
    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  aboutButtonText: {
    color: '#f2f2f2',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 12,
    padding: 24,
    paddingTop: 48,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  closeText: {
    fontSize: 30,
    lineHeight: 34,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 24,
  },
})