'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-red-400 border border-gray-800 hover:border-red-400/30 px-3 py-1.5 rounded-lg transition-all"
    >
      Esci
    </button>
  )
}