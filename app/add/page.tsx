import { AddEntryPage } from "@/components/add-entry-page"
import { BottomNav } from "@/components/bottom-nav"

export default function AddEntry() {
  return (
    <main className="min-h-screen flex flex-col">
      <AddEntryPage />
      <BottomNav activeTab="add" />
    </main>
  )
}
