'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function BookmarkList({
  userId,
  bookmarks = [],
  onBookmarkDeleted,
  onBookmarkUpdated,
}) {
  const supabase = useMemo(() => createClient(), [])
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [saving, setSaving] = useState(false)

  function getHost(url) {
    try {
      return new URL(url).host
    } catch {
      return url
    }
  }

  function normalizeUrl(rawUrl) {
    const trimmedUrl = rawUrl.trim()
    if (!trimmedUrl) return ''
    const withProtocol = /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`
    const parsedUrl = new URL(withProtocol)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('URL must start with http:// or https://')
    }
    return parsedUrl.toString()
  }

  function startEdit(bookmark) {
    setEditingId(bookmark.id)
    setEditTitle(bookmark.title)
    setEditUrl(bookmark.url)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditUrl('')
  }

  async function deleteBookmark(id) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      alert('Error deleting bookmark: ' + error.message)
      return
    }

    onBookmarkDeleted?.(id)
  }

  async function saveEdit(id) {
    if (!editTitle.trim() || !editUrl.trim()) return

    let normalizedUrl = ''
    try {
      normalizedUrl = normalizeUrl(editUrl)
    } catch {
      alert('Please enter a valid URL.')
      return
    }

    setSaving(true)
    const { data, error } = await supabase
      .from('bookmarks')
      .update({
        title: editTitle.trim(),
        url: normalizedUrl,
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle()
    setSaving(false)

    if (error) {
      alert('Error updating bookmark: ' + error.message)
      return
    }

    if (!data) {
      alert('Error updating bookmark: update not allowed. Please check your Supabase RLS update policy.')
      return
    }

    onBookmarkUpdated?.(data)
    cancelEdit()
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
      {bookmarks.map((bookmark) => {
        const isEditing = editingId === bookmark.id

        return (
          <div
            key={bookmark.id}
            className="group flex flex-col gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 transition hover:border-cyan-400/40 hover:bg-slate-900 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    placeholder="Bookmark title"
                  />
                  <input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>

            {isEditing ? (
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => saveEdit(bookmark.id)}
                  disabled={saving}
                  className="rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(bookmark)}
                  className="inline-flex items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="inline-flex items-center justify-center rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
