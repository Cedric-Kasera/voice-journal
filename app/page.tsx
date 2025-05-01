import { BottomNav } from "@/components/bottom-nav"
import { HomePage } from "@/components/home-page"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <HomePage />
      <BottomNav activeTab="home" />
    </main>
  )
}
