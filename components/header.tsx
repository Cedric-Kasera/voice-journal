"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useUserStore } from "@/lib/stores/user-store"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"
import Image from "next/image"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { username } = useUserStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="flex items-center justify-between p-4 w-full">
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8">
          <Image src="/logo.png" alt="Voice Journal Logo" width={32} height={32} className="object-contain" />
        </div>
        <span className="font-bold text-xl">VJ</span>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-hawkes-blue-600" />
          )}
        </Button>
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={(username || "User").charAt(0)} />
          <AvatarFallback>{getInitials(username || "User")}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
