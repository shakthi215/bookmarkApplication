'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function BookmarkList({ userId, initialBookmarks }) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks ?? [])
  const supabase = createClient()

  function getHost(url) {
    try {
      return new URL(url).host
    } catch {
      return url
    }
  }

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((current) => [payload.new, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((current) =>
              current.map((bookmark) =>
                bookmark.id === payload.new.id ? payload.new : bookmark
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  async function deleteBookmark(id) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      alert('Error deleting bookmark: ' + error.message)
    }
  }

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 py-14 text-center text-slate-400">
        <p className="text-lg font-semibold text-slate-300">No bookmarks yet</p>
        <p className="mt-2 text-sm">Add your first link to start building your private library.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="mb-4 text-lg font-semibold text-slate-200 sm:text-xl">
        Your Bookmarks ({bookmarks.length})
      </h2>
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group flex flex-col gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 transition hover:border-cyan-400/40 hover:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-white">{bookmark.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
              {getHost(bookmark.url)}
            </p>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate text-sm text-cyan-300 transition group-hover:text-cyan-200"
            >
              {bookmark.url}
            </a>
          </div>
          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
