// This file is used to handle the transcription of audio files using AssemblyAI API
// It receives an audio file, uploads it to AssemblyAI, and requests a transcription

import { NextResponse } from "next/server"

const API_KEY = process.env.ASSEMBLYAI_API_KEY!

export async function POST(req: Request) {
  const formData = await req.formData()
  const audioBlob = formData.get("audio") as Blob

  // Upload audio to AssemblyAI
  const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: {
      authorization: API_KEY,
    },
    body: audioBlob,
  })
  const uploadData = await uploadRes.json()
  const audioUrl = uploadData.upload_url

  // Request transcription
  const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      authorization: API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  })

  const transcriptData = await transcriptRes.json()

  return NextResponse.json({ id: transcriptData.id })
}
