'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOut() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center justify-center rounded-xl border border-rose-400/40 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/30"
    >
      Sign Out
    </button>
  )
}
