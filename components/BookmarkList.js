'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function BookmarkList({ userId, initialBookmarks }) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks ?? [])
  const supabase = createClient()

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
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No bookmarks yet!</p>
        <p className="text-sm mt-2">Add your first bookmark above to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Your Bookmarks ({bookmarks.length})
      </h2>
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 truncate">{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 truncate block"
            >
              {bookmark.url}
            </a>
          </div>
          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex-shrink-0"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
