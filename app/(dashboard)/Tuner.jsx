import { useEffect, useRef, useState } from "react"
import { AppState, StyleSheet, Text, View } from "react-native"
import { useIsFocused } from "expo-router"
import { requestRecordingPermissionsAsync } from "expo-audio"
import Pitchy from "react-native-pitchy"

import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"

const NOTE_NAMES = [
  "C", "C♯", "D", "E♭", "E", "F",
  "F♯", "G", "A♭", "A", "B♭", "B",
]

function getNote(frequency) {
  const concertMidi = 69 + 12 * Math.log2(frequency / 440)
  const nearestMidi = Math.round(concertMidi)

  // B♭ clarinet written pitch is two semitones higher.
  const writtenMidi = nearestMidi + 2

  return {
    name: NOTE_NAMES[((writtenMidi % 12) + 12) % 12],
    octave: Math.floor(writtenMidi / 12) - 1,
    cents: Math.round((concertMidi - nearestMidi) * 100),
  }
}

export default function Tuner() {
  const isFocused = useIsFocused()
  const [appState, setAppState] = useState(AppState.currentState)
  const [reading, setReading] = useState(null)
  const [status, setStatus] = useState("Preparing tuner…")

  // Keep native start/stop operations in order during tab changes.
  const operations = useRef(Promise.resolve())

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      setAppState
    )

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    if (!isFocused || appState !== "active") return

    let cancelled = false
    let subscription

    setReading(null)
    setStatus("Requesting microphone access…")

    operations.current = operations.current
      .then(async () => {
        if (cancelled) return

        const permission = await requestRecordingPermissionsAsync()
        if (cancelled) return

        if (!permission.granted) {
          setStatus(
            "Enable microphone access in iPhone Settings to use the tuner."
          )
          return
        }

        Pitchy.init({
          algorithm: "YIN",
          bufferSize: 4096,
          minVolume: -60,
        })

        subscription = Pitchy.addListener(({ pitch, confidence }) => {
          if (cancelled) return

          if (
            !Number.isFinite(pitch) ||
            pitch <= 0 ||
            confidence < 0.8
          ) {
            setReading(null)
            return
          }

          setReading({
            frequency: pitch,
            ...getNote(pitch),
          })
        })

        await Pitchy.start()

        if (!cancelled) {
          setStatus("Play a steady note")
        }
      })
      .catch((error) => {
        subscription?.remove()

        if (!cancelled) {
          setStatus(error.message || "Could not start the tuner.")
        }

        // Attempt to release audio after a failed start.
        return Pitchy.stop().catch(() => {})
      })

    return () => {
      cancelled = true
      subscription?.remove()

      operations.current = operations.current
        .then(() => Pitchy.stop())
        .catch(() => {})
    }
  }, [isFocused, appState])

  const inTune = reading && Math.abs(reading.cents) <= 5

  const guidance = !reading
    ? status
    : inTune
      ? "In tune"
      : reading.cents < 0
        ? "Flat — raise the pitch"
        : "Sharp — lower the pitch"

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.heading}>
        Clarinet Tuner
      </ThemedText>

      <ThemedText>B♭ clarinet · Written pitch · A = 440 Hz</ThemedText>

      <ThemedText style={styles.note}>
        {reading ? `${reading.name}${reading.octave}` : "—"}
      </ThemedText>

      <ThemedText style={styles.frequency}>
        {reading ? `${reading.frequency.toFixed(1)} Hz` : " "}
      </ThemedText>

      <View style={styles.meter}>
        <View style={styles.centerLine} />

        {reading && (
          <View
            style={[
              styles.needle,
              {
                left: `${
                  Math.max(0, Math.min(100, reading.cents + 50))
                }%`,
                backgroundColor: inTune ? "#22c55e" : "#f59e0b",
              },
            ]}
          />
        )}
      </View>

      <View style={styles.labels}>
        <ThemedText>Flat</ThemedText>
        <ThemedText>In tune</ThemedText>
        <ThemedText>Sharp</ThemedText>
      </View>

      <Text style={styles.cents}>
        {reading
          ? `${reading.cents > 0 ? "+" : ""}${reading.cents} cents`
          : " "}
      </Text>

      <ThemedText style={styles.guidance}>
        {guidance}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 12,
  },
  note: {
    fontSize: 72,
    lineHeight: 90,
    fontWeight: "bold",
    marginTop: 36,
  },
  frequency: {
    fontSize: 20,
    marginBottom: 32,
  },
  meter: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#9ca3af",
    position: "relative",
  },
  centerLine: {
    position: "absolute",
    left: "50%",
    top: -6,
    width: 2,
    height: 24,
    backgroundColor: "#22c55e",
  },
  needle: {
    position: "absolute",
    top: -10,
    width: 4,
    height: 32,
    marginLeft: -2,
    borderRadius: 2,
  },
  labels: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cents: {
    color: "#6b7280",
    fontSize: 18,
    marginTop: 24,
  },
  guidance: {
    marginTop: 12,
    textAlign: "center",
  },
})