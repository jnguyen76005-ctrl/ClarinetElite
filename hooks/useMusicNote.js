import { useContext } from "react"
import { MusicNoteContext } from "../contexts/MusicNoteContext"

export function useMusicNote() {
  const context = useContext(MusicNoteContext)

  if (!context) {
    throw new Error("useMusicNote must be used within a MusicNoteProvider")
  }

  return context
}