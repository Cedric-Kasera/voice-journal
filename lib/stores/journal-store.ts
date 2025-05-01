"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Entry } from "../types"

interface JournalState {
  entries: Entry[]
  loadEntries: () => void
  addEntry: (entry: Entry) => void
  deleteEntry: (id: string) => void
  toggleStarEntry: (id: string) => void
  updateEntry: (id: string, text: string, transcribed?: boolean) => void
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],

      loadEntries: () => {
        // This is handled by the persist middleware
        // But we keep this method for potential future enhancements
      },

      addEntry: (entry) => {
        set((state) => ({
          entries: [entry, ...state.entries],
        }))
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }))
      },

      toggleStarEntry: (id) => {
        set((state) => ({
          entries: state.entries.map((entry) => (entry.id === id ? { ...entry, starred: !entry.starred } : entry)),
        }))
      },

      updateEntry: (id, text, transcribed) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  text,
                  ...(transcribed !== undefined && { transcribed }),
                }
              : entry,
          ),
        }))
      },
    }),
    {
      name: "journal-storage",
      partialize: (state) => {
        // Convert Blob objects to base64 strings for storage
        return {
          entries: state.entries.map((entry) => {
            if (entry.audioBlob) {
              // We can't directly store Blob objects in localStorage
              // In a real app, we would convert to base64 here
              // For this demo, we'll just mark that audio exists
              return {
                ...entry,
                hasAudio: true,
                audioBlob: null,
              }
            }
            return entry
          }),
        }
      },
    },
  ),
)
