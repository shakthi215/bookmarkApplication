'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AddBookmark({ userId, onBookmarkAdded }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const supabase = createClient()

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !url.trim()) return
    setErrorMessage('')

    let normalizedUrl = ''
    try {
      normalizedUrl = normalizeUrl(url)
    } catch {
      setErrorMessage('Please enter a valid URL.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([
        {
          user_id: userId,
          title: title.trim(),
          url: normalizedUrl
        }
      ])
      .select('*')
      .single()

    if (error) {
      setErrorMessage(error.message)
    } else {
      if (data) {
        onBookmarkAdded?.(data)
      }
      setTitle('')
      setUrl('')
      setErrorMessage('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 sm:p-5">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Add Bookmark</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1.2fr_1.6fr_auto]">
        <input
          type="text"
          placeholder="Project docs"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          disabled={loading}
        />
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !title.trim() || !url.trim()}
          className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      {errorMessage ? (
        <p className="mt-2 text-sm text-rose-300">{errorMessage}</p>
      ) : null}
    </form>
  )
}
