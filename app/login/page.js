import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignIn from '@/components/GoogleSignIn'

export default async function Login({ searchParams }) {
  const supabase = await createClient()
  const params = await searchParams
  const authError = params?.error === 'auth_callback_failed'
  
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(14,116,144,0.2),transparent_45%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/60 backdrop-blur">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Secure Access
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">Smart Bookmarks</h1>
          <p className="mt-2 text-sm text-slate-300">Your private, realtime bookmark dashboard</p>
        </div>

        <GoogleSignIn />

        {authError ? (
          <p className="mt-4 text-center text-sm text-rose-300">
            Sign-in failed. Please try again.
          </p>
        ) : null}

        <p className="mt-6 text-center text-xs text-slate-400">
          Sign in with Google to get started
        </p>
      </div>
    </div>
  )
}
