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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Bookmarks</h1>
          <p className="text-gray-600">Save and organize your favorite links</p>
        </div>
        
        <GoogleSignIn />

        {authError ? (
          <p className="text-center text-sm text-red-600 mt-4">
            Sign-in failed. Please try again.
          </p>
        ) : null}
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Sign in with Google to get started
        </p>
      </div>
    </div>
  )
}
