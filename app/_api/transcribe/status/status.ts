// /app/api/transcribe/status/route.ts
import { NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.ASSEMBLYAI_API_KEY!

export async function POST(req: NextRequest) {
  const { id } = await req.json()

  const res = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
    headers: { authorization: API_KEY },
  })

  const data = await res.json()
  return NextResponse.json(data)
}
