export interface Entry {
  id: string
  text: string
  timestamp: number
  audioBlob?: Blob | null
  starred: boolean
  transcribed: boolean
}

export interface UserProfile {
  username: string
}
