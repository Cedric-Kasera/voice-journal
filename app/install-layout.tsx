"use client"

import type React from "react"

import { InstallPrompt } from "@/components/install-prompt"
import { useEffect, useState } from "react"

export default function InstallLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  return (
    <>
      {children}
      {isBrowser && <InstallPrompt />}
    </>
  )
}
