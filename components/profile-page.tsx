"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Play, Pause, Mic, Edit, Check, X } from "lucide-react"
import { useUserStore } from "@/lib/stores/user-store"
import { useJournalStore } from "@/lib/stores/journal-store"
import { formatTime, getInitials } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProfilePage() {
  const { username, setUsername } = useUserStore()
  const { entries, loadEntries, updateEntry } = useJournalStore()
  const [newUsername, setNewUsername] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    loadEntries()
    setNewUsername(username || "")

    return () => {
      if (audioElement) {
        audioElement.pause()
      }
    }
  }, [loadEntries, username])

  const handleSaveUsername = () => {
    if (newUsername.trim()) {
      setUsername(newUsername.trim())
      setIsEditingName(false)
      toast({
        title: "Profile updated",
        description: "Your username has been updated successfully",
      })
    } else {
      toast({
        title: "Invalid username",
        description: "Username cannot be empty",
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    setNewUsername(username || "")
    setIsEditingName(false)
  }

  const handlePlayAudio = (entryId: string, audioBlob: Blob) => {
    if (audioElement) {
      audioElement.pause()
    }

    if (currentlyPlaying === entryId) {
      setCurrentlyPlaying(null)
      return
    }

    const url = URL.createObjectURL(audioBlob)
    const audio = new Audio(url)

    audio.onended = () => {
      setCurrentlyPlaying(null)
      URL.revokeObjectURL(url)
    }

    audio.play()
    setAudioElement(audio)
    setCurrentlyPlaying(entryId)
  }

  const handleTranscribe = async (entryId: string, audioBlob: Blob) => {
    // Check if online
    if (!navigator.onLine) {
      toast({
        title: "Offline",
        description: "Please connect to the internet to transcribe audio",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Transcribing",
      description: "Your audio is being transcribed...",
    })

    try {
      // In a real app, we would send the audio to a server for transcription
      // For this demo, we'll simulate a transcription after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const simulatedTranscript = "This is a simulated transcription of your audio recording."

      // Update the entry with the transcription
      const entry = entries.find((e) => e.id === entryId)
      if (entry) {
        updateEntry(entryId, simulatedTranscript, true)

        toast({
          title: "Transcription complete",
          description: "Your audio has been transcribed successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Transcription failed",
        description: "There was an error transcribing your audio",
        variant: "destructive",
      })
    }
  }

  if (!mounted) return null

  const starredEntries = entries.filter((entry) => entry.starred)
  const audioEntries = entries.filter((entry) => entry.audioBlob)

  return (
    <div className="flex-1 flex flex-col pb-20">
      <Header />
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <div className="px-4 mb-6">
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-hawkes-blue-500 to-hawkes-blue-600"></div>
          <CardContent className="p-0">
            <div className="flex flex-col items-center -mt-12 px-6 pb-6">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900 shadow-md">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={username || "User"} />
                <AvatarFallback className="text-2xl">{getInitials(username || "User")}</AvatarFallback>
              </Avatar>

              <div className="w-full mt-4 text-center">
                {isEditingName ? (
                  <div className="space-y-3">
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="text-center"
                      autoFocus
                    />
                    <div className="flex justify-center gap-2">
                      <Button size="sm" onClick={handleSaveUsername} className="gap-1">
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit} className="gap-1">
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold">{username || "User"}</h2>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingName(true)} className="gap-1">
                      <Edit className="h-4 w-4" />
                      Edit Name
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 flex-1">
        <Tabs defaultValue="starred">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="starred">
              <Star className="h-4 w-4 mr-2" />
              Starred
            </TabsTrigger>
            <TabsTrigger value="audio">
              <Mic className="h-4 w-4 mr-2" />
              Audio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="starred" className="mt-4">
            <ScrollArea className="h-[calc(100vh-400px)]">
              {starredEntries.length > 0 ? (
                <div className="space-y-3">
                  {starredEntries.map((entry) => (
                    <Card key={entry.id} className="entry-card">
                      <CardContent className="p-4">
                        <p className="text-sm mb-2">{entry.text}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(entry.timestamp)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No starred entries yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Star your favorite entries to see them here
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="audio" className="mt-4">
            <ScrollArea className="h-[calc(100vh-400px)]">
              {audioEntries.length > 0 ? (
                <div className="space-y-3">
                  {audioEntries.map((entry) => (
                    <Card key={entry.id} className="entry-card">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm mb-1">
                              {entry.text
                                ? entry.text.substring(0, 30) + (entry.text.length > 30 ? "..." : "")
                                : "Audio recording"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(entry.timestamp)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handlePlayAudio(entry.id, entry.audioBlob!)}
                            >
                              {currentlyPlaying === entry.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              <span className="sr-only">{currentlyPlaying === entry.id ? "Pause" : "Play"}</span>
                            </Button>

                            {!entry.transcribed && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTranscribe(entry.id, entry.audioBlob!)}
                              >
                                Transcribe
                              </Button>
                            )}

                            {entry.transcribed && (
                              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full flex items-center">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                                Transcribed
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No audio recordings yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Record your thoughts to see them here</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
