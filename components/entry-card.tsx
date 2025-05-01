"use client"

import type React from "react"

import { useState } from "react"
import type { Entry } from "@/lib/types"
import { formatTime, truncateText } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Star, FileText, Edit } from "lucide-react"
import { useJournalStore } from "@/lib/stores/journal-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

type EntryCardProps = {
  entry: Entry
}

export function EntryCard({ entry }: EntryCardProps) {
  const { deleteEntry, toggleStarEntry, updateEntry } = useJournalStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(entry.text)
  const [showFullEntry, setShowFullEntry] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swiping, setSwiping] = useState(false)
  const { toast } = useToast()

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)

    if (touchStart && touchEnd) {
      const distance = touchStart - touchEnd
      if (distance > 50) {
        setSwiping(true)
      } else {
        setSwiping(false)
      }
    }
  }

  const handleTouchEnd = () => {
    if (touchStart && touchEnd && touchStart - touchEnd > 100) {
      handleDelete()
    }

    setTouchStart(null)
    setTouchEnd(null)
    setSwiping(false)
  }

  const handleDelete = () => {
    deleteEntry(entry.id)
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted",
    })
  }

  const handleToggleStar = () => {
    toggleStarEntry(entry.id)
  }

  const handleSaveEdit = () => {
    updateEntry(entry.id, editedText)
    setIsEditing(false)
    toast({
      title: "Entry updated",
      description: "Your journal entry has been updated",
    })
  }

  const handleExport = (format: "txt" | "pdf") => {
    const filename = `journal-entry-${new Date(entry.timestamp).toISOString().split("T")[0]}`
    const content = `${new Date(entry.timestamp).toLocaleString()}\n\n${entry.text}`

    if (format === "txt") {
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // For PDF, we'd normally use a library like jsPDF
      // This is a simplified version
      toast({
        title: "PDF Export",
        description: "PDF export functionality would be implemented here",
      })
    }
  }

  return (
    <div className="relative" style={{ transform: swiping ? "translateX(-80px)" : "translateX(0)" }}>
      <Card
        className={`entry-card transition-transform ${swiping ? "opacity-90" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => !swiping && setShowFullEntry(true)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm mb-2">{truncateText(entry.text, 20)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(entry.timestamp)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {swiping && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-red-500 rounded-r-lg w-16 swipe-action">
          <Trash2 className="h-5 w-5 text-white" />
        </div>
      )}

      <Dialog open={showFullEntry} onOpenChange={setShowFullEntry}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Journal Entry</DialogTitle>
          </DialogHeader>

          {isEditing ? (
            <div className="space-y-4">
              <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} className="min-h-[200px]" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm mb-2">{entry.text}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>

              <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport("txt")}>
                    <FileText className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <Button variant={entry.starred ? "default" : "outline"} size="sm" onClick={handleToggleStar}>
                  <Star className={`h-4 w-4 ${entry.starred ? "fill-current" : ""}`} />
                  <span className="sr-only">Star</span>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
