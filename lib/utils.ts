import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Entry } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxWords: number): string {
  if (!text) return ""

  const words = text.split(" ")
  if (words.length <= maxWords) return text

  return words.slice(0, maxWords).join(" ") + "..."
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function groupEntriesByDate(entries: Entry[]): Record<string, Entry[]> {
  const grouped: Record<string, Entry[]> = {}

  entries.forEach((entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    if (!grouped[date]) {
      grouped[date] = []
    }

    grouped[date].push(entry)
  })

  // Sort entries within each date group by timestamp (newest first)
  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => b.timestamp - a.timestamp)
  })

  return grouped
}

export function getInitials(name: string): string {
  if (!name) return "U"

  const names = name.trim().split(/\s+/)

  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  } else {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
  }
}
