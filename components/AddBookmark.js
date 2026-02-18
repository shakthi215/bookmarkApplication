'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AddBookmark({ userId }) {
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

    const { error } = await supabase
      .from('bookmarks')
      .insert([
        { 
          user_id: userId, 
          title: title.trim(), 
          url: normalizedUrl
        }
      ])

    if (error) {
      setErrorMessage(error.message)
    } else {
      setTitle('')
      setUrl('')
      setErrorMessage('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !title.trim() || !url.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </form>
  )
}
