'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import AddBookmark from '@/components/AddBookmark'
import BookmarkList from '@/components/BookmarkList'

export default function BookmarksDashboard({ userId, initialBookmarks }) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks ?? [])
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const channel = supabase
      .channel(`bookmarks-${userId}`)
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
            setBookmarks((current) => {
              if (current.some((bookmark) => bookmark.id === payload.new.id)) return current
              return [payload.new, ...current]
            })
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

  function handleBookmarkAdded(newBookmark) {
    setBookmarks((current) => {
      if (current.some((bookmark) => bookmark.id === newBookmark.id)) return current
      return [newBookmark, ...current]
    })
  }

  function handleBookmarkDeleted(id) {
    setBookmarks((current) => current.filter((bookmark) => bookmark.id !== id))
  }

  function handleBookmarkUpdated(updatedBookmark) {
    setBookmarks((current) =>
      current.map((bookmark) =>
        bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
      )
    )
  }

  return (
    <>
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

      <AddBookmark userId={userId} onBookmarkAdded={handleBookmarkAdded} />
      <BookmarkList
        userId={userId}
        bookmarks={bookmarks}
        onBookmarkDeleted={handleBookmarkDeleted}
        onBookmarkUpdated={handleBookmarkUpdated}
      />
    </>
  )
}
