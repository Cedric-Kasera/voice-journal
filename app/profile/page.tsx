import { BottomNav } from "@/components/bottom-nav"
import { ProfilePage } from "@/components/profile-page"

export default function Profile() {
  return (
    <main className="min-h-screen flex flex-col">
      <ProfilePage />
      <BottomNav activeTab="profile" />
    </main>
  )
}
