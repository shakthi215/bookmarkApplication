# Smart Bookmark App

A modern, real-time bookmark manager built with Next.js and Supabase, featuring Google OAuth authentication and instant synchronization across devices.

## 🌟 Live Demo

**Deployed URL:** [\[Your Vercel URL Here\]](https://bookmark-application-hazel.vercel.app/)

## 📋 Project Overview

This application allows users to save, manage, and organize their favorite web links with real-time synchronization. Each user has a private collection of bookmarks that updates instantly across all open sessions.

### Key Features

- **🔐 Google OAuth Authentication** - Secure, passwordless sign-in using Google accounts
- **📱 Real-time Updates** - Bookmarks sync instantly across all open tabs and devices
- **🔒 Private Collections** - Each user's bookmarks are completely private and isolated
- **➕ Quick Add** - Simple interface to add new bookmarks with title and URL
- **🗑️ Easy Management** - Delete unwanted bookmarks with a single click
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **⚡ Fast Performance** - Built with Next.js App Router for optimal speed

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** (App Router) - React framework for production
- **React 18+** - UI component library
- **Tailwind CSS** - Utility-first CSS framework for styling

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
  - PostgreSQL database for data storage
  - Row Level Security (RLS) for data privacy
  - Real-time subscriptions for live updates
  - Authentication with Google OAuth provider

### Deployment
- **Vercel** - Platform for hosting and continuous deployment

## 📁 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.js          # OAuth callback handler
│   ├── login/
│   │   └── page.js                # Login page with Google sign-in
│   ├── page.js                    # Main dashboard (protected route)
│   ├── layout.js                  # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── AddBookmark.js             # Form to add new bookmarks
│   ├── BookmarkList.js            # Display bookmarks with real-time updates
│   ├── GoogleSignIn.js            # Google OAuth sign-in button
│   └── SignOut.js                 # Sign-out button
├── utils/
│   └── supabase/
│       ├── client.js              # Browser-side Supabase client
│       └── server.js              # Server-side Supabase client
├── middleware.js                  # Auth middleware for protected routes
├── .env.local                     # Environment variables (not in repo)
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control
- A Supabase account
- A Google Cloud account (for OAuth)
- A Vercel account (for deployment)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/smart-bookmark-app.git
   cd smart-bookmark-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Supabase Setup

1. **Create a Supabase Project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Database Schema**
   
   Run this SQL in the Supabase SQL Editor:
   ```sql
   -- Create bookmarks table
   create table bookmarks (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     user_id uuid references auth.users not null,
     title text not null,
     url text not null
   );

   -- Enable Row Level Security
   alter table bookmarks enable row level security;

   -- Create policies for user data privacy
   create policy "Users can view own bookmarks"
     on bookmarks for select
     using (auth.uid() = user_id);

   create policy "Users can insert own bookmarks"
     on bookmarks for insert
     with check (auth.uid() = user_id);

   create policy "Users can delete own bookmarks"
     on bookmarks for delete
     using (auth.uid() = user_id);

   -- Enable real-time updates
   alter publication supabase_realtime add table bookmarks;
   ```

3. **Configure Google OAuth**
   - Go to Authentication > Providers in Supabase
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Secret)

### Google Cloud Setup

1. **Create OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 Client ID credentials
   - Add authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

2. **Configure OAuth Consent Screen**
   - Set application name and contact information
   - Add required scopes (email, profile)

## 🌐 Deployment

### Deploying to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Your app will be live at `https://your-app.vercel.app`

4. **Update Google OAuth**
   - Add your Vercel URL to Google Cloud authorized redirect URIs
   - Format: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

## 📱 Features in Detail

### Authentication Flow
1. User visits the app and sees the login page
2. Clicks "Continue with Google"
3. Redirected to Google's OAuth consent screen
4. After approval, redirected back to the app
5. Session is established and user can access bookmarks

### Real-time Synchronization
- Uses Supabase's real-time subscriptions
- Listens for INSERT and DELETE events on the bookmarks table
- Automatically updates the UI when changes occur
- Works across multiple browser tabs and devices

### Data Privacy
- Implemented using Row Level Security (RLS) policies
- Users can only read, insert, and delete their own bookmarks
- Database-level enforcement ensures data isolation
- No user can access another user's bookmarks

## 🔒 Security Features

- **OAuth 2.0** - Industry-standard authentication protocol
- **Row Level Security** - Database-level access control
- **HTTPS** - All communications encrypted in production
- **Session Management** - Secure cookie-based sessions via Supabase Auth
- **Environment Variables** - Sensitive keys stored securely

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can sign in with Google account
- [ ] User can add a bookmark with title and URL
- [ ] Bookmarks appear in the list immediately after adding
- [ ] User can delete their own bookmarks
- [ ] Real-time updates work (test with two browser tabs)
- [ ] User A cannot see User B's bookmarks
- [ ] User can sign out successfully
- [ ] App is responsive on mobile devices

### Testing Real-time Features

1. Open the app in two different browser tabs
2. Add a bookmark in Tab 1
3. Verify it appears instantly in Tab 2
4. Delete a bookmark in Tab 2
5. Verify it disappears from Tab 1

## 📊 Database Schema

### `bookmarks` Table

| Column      | Type      | Description                          |
|-------------|-----------|--------------------------------------|
| id          | uuid      | Primary key (auto-generated)         |
| created_at  | timestamp | Timestamp of creation (auto-set)     |
| user_id     | uuid      | Foreign key to auth.users            |
| title       | text      | Bookmark title (required)            |
| url         | text      | Bookmark URL (required)              |

### Relationships

- `user_id` references `auth.users(id)` - Links bookmarks to authenticated users

### Indexes

- Primary key on `id`
- Automatic index on `user_id` for efficient queries

## 🎨 UI/UX Design

- **Clean and Modern** - Minimalist interface with focus on functionality
- **Gradient Background** - Blue to indigo gradient for visual appeal
- **Card-based Layout** - Content organized in clean, shadowed cards
- **Responsive Grid** - Adapts to different screen sizes
- **Hover Effects** - Interactive feedback on buttons and links
- **Loading States** - Clear indicators during async operations

## 📈 Performance Optimizations

- **Next.js App Router** - Automatic code splitting and prefetching
- **Server Components** - Reduced JavaScript bundle size
- **Optimistic Updates** - Instant UI feedback before server confirmation
- **Efficient Queries** - Filtered database queries using user_id
- **Real-time Subscriptions** - Only listening to user's own data changes

## 🐛 Known Limitations

- Single user sign-in per browser (no multi-account switching)
- No bookmark editing feature (only add/delete)
- No folder organization or tagging system
- No bookmark search functionality
- No bulk operations (select multiple, delete all, etc.)

## 🔮 Future Enhancements

- [ ] Add bookmark editing capability
- [ ] Implement folders/categories for organization
- [ ] Add tags and search functionality
- [ ] Include bookmark thumbnails/favicons
- [ ] Add import/export functionality
- [ ] Implement sharing bookmarks with other users
- [ ] Add dark mode support
- [ ] Include bookmark notes/descriptions
- [ ] Add browser extension for quick bookmarking

## 📄 License

This project is created for educational purposes as part of a coding assignment.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Supabase for the backend infrastructure
- Vercel for hosting and deployment
- Google for OAuth authentication services
- Tailwind CSS for the styling framework

## 📞 Support

If you encounter any issues or have questions:
1. Check the Supabase logs in your project dashboard
2. Review the browser console for client-side errors
3. Verify all environment variables are correctly set
4. Ensure Google OAuth is properly configured

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

---

**Built with ❤️ using Next.js and Supabase**