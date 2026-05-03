# Arabic Learning App

A gamified mobile-first app for learning Arabic using the 6 meta-learning rules from the "Master anything 5x faster" video.

## Stack
- **Next.js 14** — App Router, Server Components for data fetching
- **React** — Client Components for interactive UI
- **Tailwind CSS** — styling
- **Supabase** — PostgreSQL database
- **TypeScript** — strict mode throughout

## Setup
1. `cp .env.example .env.local` and fill in Supabase URL + anon key
2. Run `supabase/schema.sql` in your Supabase SQL Editor
3. `npm install`
4. `npm run dev` → http://localhost:3000

## Project structure
```
src/
  app/
    layout.tsx          — root layout with BottomNav
    page.tsx            — Quest screen (Rule 1+6)
    train/page.tsx      — Train screen (Rule 3)
    bosses/page.tsx     — Bosses screen (Rule 1+5)
    party/page.tsx      — Party screen (Rule 2)
    log/page.tsx        — Log screen (Rule 4+1+6)
  components/
    BottomNav.tsx       — 5-tab navigation
    screens/            — one component per screen
    ui/                 — TopBar, Badge (shared primitives)
  lib/
    supabase.ts         — Supabase client + fetchAll helper
    types.ts            — TypeScript interfaces
    utils.ts            — cn(), getInitials(), xpToLevel()
supabase/
  schema.sql            — run once in Supabase SQL Editor
```

## The 6 meta-learning rules (from transcript)
| Rule | Description | Screen |
|------|-------------|--------|
| 1 | Get early wins — dopamine loop | Quest checklist, Log wins |
| 2 | Right teacher or strategy | Party — add teachers with their method |
| 3 | Key leverage points (80/20) | Train — word deck + pattern rules |
| 4 | Tight feedback loop | Log — feedback sessions with score + notes |
| 5 | Courage to regress | Bosses — public commitments with witnesses |
| 6 | Identity shift | Quest — identity banner + identity-proof wins |

## Data model
- `teachers` — Rule 2: name, role (teacher/witness/native), strategy
- `keywords` — Rule 3: Arabic word, translation, example, is_learned
- `pattern_rules` — Rule 3: pattern description + examples
- `shame_tasks` — Rules 1+5: title, shame_level, status, witness_ids
- `wins` — Rules 1+6: description, is_proof (identity evidence)
- `feedback_sessions` — Rule 4: score (1-5), who, notes

## Key interactions
- Quest checklist — tap each rule row to tick it off → earns XP
- Train flashcard — tap to reveal → rate Again/Hard/Good/Easy → next card
- Word chips — tap a word chip to toggle learned/not-learned
- Boss cards — Mark done (+XP) or Failed (-25 XP + shame point)
- Party — add teachers with their strategy/method field
- Log — add feedback sessions with score, who, and what to adjust
- Wins — mark a win as identity proof (Rule 6) or regular win (Rule 1)

## What to build next
- Supabase Auth — multiple users with their own boards
- Push notifications — notify witnesses when a boss is failed
- Streak tracking — calculate from feedback_sessions dates
- XP persistence — store XP and level in a user_profile table
- PWA manifest — installable on phone home screen
