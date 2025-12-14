# AI Note Summarizer

A Next.js application that helps you summarize long notes using AI.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment Checklist

### Vercel Deployment

1. **Environment Variables**
   - Set `NEXT_PUBLIC_SITE_URL` in Vercel dashboard:
     - Production: `https://your-production-domain.com`
     - Preview deployments: Can use `VERCEL_URL` (auto-set) or set explicitly
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
   - Ensure `OPENAI_API_KEY` is set (server-side only)

2. **Supabase Configuration**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Set **Site URL** to your production domain (e.g., `https://your-production-domain.com`)
   - Add **Redirect URLs**:
     - `https://your-production-domain.com/auth/callback`
     - `https://*.vercel.app/auth/callback` (for preview deployments)
     - `http://localhost:3000/auth/callback` (for local development)

3. **Verify Redirects**
   - After deployment, test the signup flow:
     - Sign up with a new email
     - Check email for confirmation link
     - Click link → should redirect to production domain, not localhost
     - Should land on `/dashboard` after authentication

### Environment Variable Priority

The app uses the following priority for determining the site URL:

1. `NEXT_PUBLIC_SITE_URL` (explicitly set - recommended for production)
2. `VERCEL_URL` (automatically set by Vercel - includes protocol)
3. `http://localhost:3000` (fallback for local development)

**Note:** If `NEXT_PUBLIC_SITE_URL` is missing in production, a warning will be logged but the app will still work using `VERCEL_URL`.

## Features

- Create and manage notes
- AI-powered summarization using OpenAI
- User authentication with Supabase
- Private notes per user (Row Level Security)
- Dark mode support

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase (Database + Auth)
- OpenAI API
