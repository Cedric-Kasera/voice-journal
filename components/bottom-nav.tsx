"use client"

import { Home, User, Mic } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

type BottomNavProps = {
  activeTab: "home" | "add" | "profile"
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 px-4 z-10">
      <div className="max-w-md mx-auto flex items-center justify-around">
        <Link
          href="/"
          className={`bottom-nav-item flex flex-col items-center p-2 ${activeTab === "home" ? "active" : ""}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          href="/add"
          className={`bottom-nav-item flex flex-col items-center p-2 ${activeTab === "add" ? "active" : ""}`}
        >
          <div className="rounded-full bg-hawkes-blue-600 text-white p-3 -mt-8 mb-1 flex items-center justify-center">
            <Mic size={24} />
          </div>
          <span className="text-xs">Add</span>
        </Link>
        <Link
          href="/profile"
          className={`bottom-nav-item flex flex-col items-center p-2 ${activeTab === "profile" ? "active" : ""}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
