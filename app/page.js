import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/BookmarkList'
import AddBookmark from '@/components/AddBookmark'
import SignOut from '@/components/SignOut'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks = [] } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const metaName = user.user_metadata?.full_name || user.user_metadata?.name || ''
  const fallbackName = user.email ? user.email.split('@')[0] : 'there'
  const displayName = (metaName || fallbackName).split(' ')[0]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="rounded-3xl border border-slate-800 bg-[radial-gradient(120%_120%_at_50%_0%,#1e293b_0%,#0f172a_45%,#020617_100%)] p-6 shadow-2xl shadow-slate-950/50 sm:p-8">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Smart Bookmark Hub
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome, {displayName}
              </h1>
              <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                Save important links, keep them private, and watch updates appear instantly across tabs.
              </p>
            </div>
            <SignOut />
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Bookmarks</p>
              <p className="mt-1 text-2xl font-bold text-white">{bookmarks.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Visibility</p>
              <p className="mt-1 text-lg font-semibold text-emerald-300">Private</p>
            </div>
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Sync</p>
              <p className="mt-1 text-lg font-semibold text-cyan-300">Realtime On</p>
            </div>
          </div>

          <AddBookmark userId={user.id} />
          <BookmarkList userId={user.id} initialBookmarks={bookmarks} />
        </div>
      </div>
    </div>
  )
}
