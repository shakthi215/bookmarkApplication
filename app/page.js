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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Smart Bookmarks</h1>
              <p className="text-gray-600 mt-1">Welcome, {user.email}</p>
            </div>
            <SignOut />
          </div>
          
          <AddBookmark userId={user.id} />
          <BookmarkList userId={user.id} initialBookmarks={bookmarks} />
        </div>
      </div>
    </div>
  )
}
