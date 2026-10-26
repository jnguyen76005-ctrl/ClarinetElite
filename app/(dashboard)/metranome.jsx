
import { useState } from 'react'

import { View,Text, TextInput, Pressable, StyleSheet, useColorScheme,TouchableWithoutFeedback,Keyboard} from 'react-native'

import { Colors } from '../../constants/Colors'

import useMetronomeEngine from '../../hooks/useMetronomeEngine'

export default function Metronome() {
  // Use your app's existing light/dark theme.
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  // Metronome settings.
  const [bpm, setBpm] = useState('100')
  const [beats, setBeats] = useState('4')
  const [playing, setPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(-1)

  // Convert the text inputs into numbers.
  const bpmNumber = Number(bpm)
  const beatsNumber = Number(beats)

  // Validate BPM.
  const validBpm =
    bpm.trim() !== '' &&
    Number.isInteger(bpmNumber) &&
    bpmNumber >= 30 &&
    bpmNumber <= 240

  // Validate beats per measure.
  const validBeats =
    beats.trim() !== '' &&
    Number.isInteger(beatsNumber) &&
    beatsNumber >= 2 &&
    beatsNumber <= 12

  const inputsValid = validBpm && validBeats

  // native audio engine.
  useMetronomeEngine(
    inputsValid ? bpmNumber : 100,
    inputsValid ? beatsNumber : 4,
    playing && inputsValid
  )

  // Play-Stop button.
  function togglePlaying() {
    if (!playing && !inputsValid) return

    setPlaying(previous => !previous)
  }

  // Increase or decrease BPM.
  function changeBpm(amount) {
    const newBpm = Math.max(
      30,
      Math.min(
        240,
        (validBpm ? bpmNumber : 100) + amount
      )
    )

    setBpm(String(newBpm))
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: theme.title },
          ]}
        >
          Metronome
        </Text>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Beats Per Minute
        </Text>

        <View style={styles.bpmRow}>
          <Pressable
            style={styles.adjustButton}
            onPress={() => changeBpm(-5)}
          >
            <Text style={styles.adjustText}>−</Text>
          </Pressable>

          <TextInput
            value={bpm}
            onChangeText={(text) => {
              setPlaying(false)
              setBpm(text)
            }}
            keyboardType="number-pad"
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.uiBackground,
                borderColor: validBpm
                  ? Colors.primary
                  : Colors.warning,
              },
            ]}
          />

          <Pressable
            style={styles.adjustButton}
            onPress={() => changeBpm(5)}
          >
            <Text style={styles.adjustText}>+</Text>
          </Pressable>
        </View>

        <Text
          style={[
            styles.label,
            { color: theme.text },
          ]}
        >
          Beats Per Measure
        </Text>

        <TextInput
          value={beats}
          onChangeText={(text) => {
            setPlaying(false)
            setBeats(text)
          }}
          keyboardType="number-pad"
          style={[
            styles.input,
            {
              color: theme.text,
              backgroundColor: theme.uiBackground,
              borderColor: validBeats
                ? Colors.primary
                : Colors.warning,
            },
          ]}
        />

        {!inputsValid && (
          <Text style={styles.errorText}>
            Enter 30–240 BPM and 2–12 beats.
          </Text>
        )}

        <View style={styles.beatRow}>
          {Array.from(
            {
              length: validBeats
                ? beatsNumber
                : 4,
            },
            ( _ , index) => (
              <View
                key={index}
                style={[
                  styles.beatCircle,
                  {
                    backgroundColor:
                      currentBeat === index
                        ? Colors.primary
                        : theme.uiBackground,
                  },
                ]}
              />
            )
          )}
        </View>

        <Text
          style={[
            styles.beatLabel,
            { color: theme.text },
          ]}
        >
          {currentBeat === -1
            ? 'Ready'
            : `Beat ${currentBeat + 1}`}
        </Text>

        <Pressable
          onPress={togglePlaying}
          disabled={!playing && !inputsValid}
          style={[
            styles.playButton,
            {
              backgroundColor:
                !playing && !inputsValid
                  ? theme.uiBackground
                  : Colors.primary,
            },
          ]}
        >
          <Text style={styles.playText}>
            {playing ? 'Stop' : 'Play'}
          </Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  )
}

// Styling.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
  },

  bpmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  input: {
    width: 110,
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    fontSize: 25,
    textAlign: 'center',
  },

  adjustButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  adjustText: {
    fontSize: 28,
    color: 'white',
  },

  beatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },

  beatCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
  },

  beatLabel: {
    fontSize: 18,
    marginBottom: 10,
  },

  playButton: {
    width: 180,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },

  playText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  errorText: {
    color: Colors.warning,
    textAlign: 'center',
  },
})
