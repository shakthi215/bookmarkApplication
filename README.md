# Smart Bookmark App

A modern, real-time bookmark manager built with Next.js and Supabase, featuring Google OAuth authentication and instant synchronization across devices.

## 🌟 Live Demo

**Deployed URL:** (https://bookmark-application-hazel.vercel.app/)

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

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control
- A Supabase account
- A Google Cloud account (for OAuth)
- A Vercel account (for deployment)

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
- GitHub: [@shakthi215](https://github.com/shakthi215)
- Email: shakthis045@gmail.com

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