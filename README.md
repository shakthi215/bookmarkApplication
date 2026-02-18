# Smart Bookmark App

Private bookmark manager built with Next.js App Router + Supabase Auth/DB/Realtime.

## Features

- Google OAuth sign-in only
- Add bookmark (title + URL)
- Per-user private bookmarks (RLS policies)
- Realtime list updates across tabs
- Delete own bookmarks

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add env vars in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. In Supabase SQL editor, run:
`supabase/schema.sql`

4. In Supabase:
- Auth -> Providers -> Google: enable Google OAuth
- Auth -> URL Configuration: add your callback URL:
`https://your-domain.com/auth/callback`
- Realtime -> Replication: ensure `bookmarks` table is enabled

5. Run locally:
```bash
npm run dev
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables.
4. Add your Vercel domain to Supabase Auth redirect URLs:
`https://your-vercel-domain.vercel.app/auth/callback`
