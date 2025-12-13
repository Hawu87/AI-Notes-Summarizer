# AIR.md

## 1. Product Overview
AI Note Summarizer is a lightweight web application that allows users to create text notes and instantly generate AI summaries for them. Users can paste or type any long text (notes, emails, articles, contracts, messages), click **“Summarize with AI”**, and receive:
- A clean 2–4 sentence summary
- 3–5 key bullet points

All notes and summaries are stored persistently so users can revisit them later. The UI is minimal, reading-first, and optimized for fast comprehension.

---

## 2. Target Users & Problems

### Target Users
- Students summarizing lecture notes and readings
- Knowledge workers summarizing emails, reports, and meetings
- Researchers condensing long text excerpts
- General users summarizing any long text

### Core Problems
- Long text is time-consuming to reread
- Users want fast, structured takeaways
- Users want consistency and clarity
- Users want access to summary history

---

## 3. Core MVP Scope (Week 1)

### Must-Have Features
- Create a note (title + body)
- Summarize note with AI
- View summary + bullet points
- Dashboard with note history
- Persistent storage (Supabase)

### Explicit Non-Goals
- Tags, folders, search
- Sharing or collaboration
- Rich text editor
- Billing or limits

---

## 4. User Flows

### New User
Visit app → Create note → Summarize → View results

### Returning User
Open dashboard → Select note → View original + summary

---

## 5. UX & Design Principles
- Minimal UI
- Split reading experience
- 2-click summarization
- Fast feedback
- Readable output

---

## 6. Tech Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Shadcn UI
- Supabase (Postgres)
- OpenAI gpt-4.1-mini
- Auth deferred (Clerk later)

---

## 7. Project Folder Structure (Authoritative)

src/
├── app/
│   ├── api/summarize/route.ts
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── notes/
│   └── layout/
├── lib/
│   ├── supabase.ts
│   ├── openai.ts
│   └── utils.ts
└── types/

---

## 8. Data Model

### notes
- id (uuid)
- user_id (text)
- title (text)
- content (text)
- created_at (timestamp)

### summaries
- id (uuid)
- note_id (uuid)
- summary_text (text)
- bullet_points_json (json)
- created_at (timestamp)

---

## 9. API Contract

POST /api/summarize  
Input: noteId, content  
Output: summary, bullets[]

---

## 10. Cursor Instructions
- Follow folder structure exactly
- Use Shadcn UI components
- Keep logic out of page.tsx
- Assume placeholder user_id
- Supabase is the source of truth
