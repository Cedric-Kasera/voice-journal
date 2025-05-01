"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { EntryCard } from "@/components/entry-card"
import { useUserStore } from "@/lib/stores/user-store"
import { useJournalStore } from "@/lib/stores/journal-store"
import type { Entry } from "@/lib/types"
import { groupEntriesByDate } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export function HomePage() {
  const { username } = useUserStore()
  const { entries, loadEntries } = useJournalStore()
  const [mounted, setMounted] = useState(false)
  const [groupedEntries, setGroupedEntries] = useState<Record<string, Entry[]>>({})

  useEffect(() => {
    setMounted(true)
    loadEntries()
  }, [loadEntries])

  useEffect(() => {
    if (entries.length > 0) {
      setGroupedEntries(groupEntriesByDate(entries))
    }
  }, [entries])

  if (!mounted) return null

  return (
    <div className="flex-1 flex flex-col pb-20">
      <Header />
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-semibold">Hello, {username || "User"}</h1>
      </div>
      <ScrollArea className="flex-1 px-4">
        {Object.keys(groupedEntries).length > 0 ? (
          Object.entries(groupedEntries)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([date, dateEntries]) => (
              <div key={date} className="mb-6">
                <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">{date}</h2>
                <div className="space-y-3">
                  {dateEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No journal entries yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Start recording your thoughts by tapping the Add button below
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
