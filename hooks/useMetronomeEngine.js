
import { useEffect, useRef } from 'react'
import { AudioContext } from 'react-native-audio-api'

export default function useMetronomeEngine(
  bpm,
  beats,
  playing
) {
  const contextRef = useRef(null)

  useEffect(() => {
    if (!playing) return

    if (
      !Number.isFinite(bpm) ||
      bpm < 30 ||
      bpm > 240 ||
      !Number.isInteger(beats) ||
      beats < 2 ||
      beats > 12
    ) {
      return
    }

    const context = new AudioContext()
    contextRef.current = context

    let active = true
    let beatNumber = 0

    const secondsPerBeat = 60 / bpm
    const schedulerInterval = 25
    const scheduleAhead = 0.2

    let nextBeatTime = context.currentTime + 0.1

    // Generate the click waveform only once.
    function createClickBuffer() {
      const sampleRate = context.sampleRate

     
      const duration = 0.035
      const length = Math.ceil(
        sampleRate * duration
      )

      const buffer = context.createBuffer(
        1,
        length,
        sampleRate
      )

      const samples = new Float32Array(length)
      const frequency = 1000

      for (let i = 0; i < length; i++) {
        const time = i / sampleRate

        // Fade in 
        const attack = Math.min(1, time / 0.002)

        // Fade out 
        const decay = Math.pow(
          Math.max(0, 1 - time / duration),
          3
        )

        const envelope = attack * decay

        samples[i] =
          Math.sin(2 * Math.PI * frequency * time) *
          envelope
      }

      buffer.copyToChannel(samples, 0)

      return buffer
    }

    const clickBuffer = createClickBuffer()

  
    function scheduleClick(time, isAccent) {
      const source = context.createBufferSource()
      const volume = context.createGain()

      // same sound for every beat.
      source.buffer = clickBuffer

      // Only volume differs.
      volume.gain.value = isAccent ? 0.4 : 0.15

      source.connect(volume)
      volume.connect(context.destination)

    
      source.start(time)
    }

    function scheduler() {
      if (!active) return

      try {
        const now = context.currentTime

        // Skip missed beat positions 
       
        if (nextBeatTime < now) {
          const missedBeats = Math.ceil(
            (now - nextBeatTime) / secondsPerBeat
          )

          nextBeatTime += missedBeats * secondsPerBeat

          beatNumber = (beatNumber + missedBeats) % beats
        }

        // Schedule upcoming beats in advance.
        while (
          active &&
          nextBeatTime <
            context.currentTime + scheduleAhead
        ) {
          // Beat 1 is always accented.
          const isAccent = beatNumber === 0

          scheduleClick(nextBeatTime, isAccent)

          beatNumber =
            (beatNumber + 1) % beats

          nextBeatTime += secondsPerBeat
        }
      } catch (error) {
        console.warn(
          'Metronome scheduling error:',
          error
        )
      }
    }

    scheduler()

    const timer = setInterval(
      scheduler,
      schedulerInterval
    )

    return () => {
      active = false
      clearInterval(timer)

      if (contextRef.current === context) {
        contextRef.current = null
      }

      Promise.resolve(context.close()).catch(
        error => {
          console.warn(
            'Audio context cleanup error:',
            error
          )
        }
      )
    }
  }, [bpm, beats, playing])
}
