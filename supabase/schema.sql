-- ─────────────────────────────────────────────────────────────
-- Arabic Learning App — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- Rule 2: Teachers / witnesses / native speakers
create table if not exists teachers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null check (role in ('teacher', 'witness', 'native')),
  strategy    text,          -- their learning method / why you picked them
  initials    text not null,
  created_at  timestamptz default now()
);

-- Rule 3: 80/20 keyword deck
create table if not exists keywords (
  id           uuid primary key default gen_random_uuid(),
  word         text not null,   -- Arabic word
  translation  text not null,
  example      text,            -- example sentence
  is_learned   boolean default false,
  created_at   timestamptz default now()
);

-- Rule 3: Pattern rules (e.g. "-al" cognates)
create table if not exists pattern_rules (
  id          uuid primary key default gen_random_uuid(),
  rule        text not null,    -- the pattern description
  examples    text,             -- comma-separated examples
  created_at  timestamptz default now()
);

-- Rules 1+5: Shame tasks / boss battles
create table if not exists shame_tasks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  shame_level  text not null check (shame_level in ('high', 'mid', 'low')),
  status       text not null default 'pending' check (status in ('pending', 'done', 'failed')),
  witness_ids  uuid[] default '{}',   -- references teachers.id
  due_date     date,
  created_at   timestamptz default now()
);

-- Rule 1+6: Wins log (is_proof = identity evidence)
create table if not exists wins (
  id           uuid primary key default gen_random_uuid(),
  description  text not null,
  is_proof     boolean default false,  -- Rule 6: proves Arabic speaker identity
  created_at   timestamptz default now()
);

-- Rule 4: Feedback sessions
create table if not exists feedback_sessions (
  id          uuid primary key default gen_random_uuid(),
  score       integer not null check (score between 1 and 5),
  who         text not null default 'self',
  notes       text,
  created_at  timestamptz default now()
);

-- ─── Row Level Security (open for now — add auth later) ───────
alter table teachers          enable row level security;
alter table keywords          enable row level security;
alter table pattern_rules     enable row level security;
alter table shame_tasks       enable row level security;
alter table wins              enable row level security;
alter table feedback_sessions enable row level security;

-- Allow all operations for anon key (single-user app for now)
create policy "allow all" on teachers          for all using (true) with check (true);
create policy "allow all" on keywords          for all using (true) with check (true);
create policy "allow all" on pattern_rules     for all using (true) with check (true);
create policy "allow all" on shame_tasks       for all using (true) with check (true);
create policy "allow all" on wins              for all using (true) with check (true);
create policy "allow all" on feedback_sessions for all using (true) with check (true);

-- ─── Seed data ────────────────────────────────────────────────
insert into keywords (word, translation, example, is_learned) values
  ('مَرحَبا',  'hello',          'مَرحَبا، كيف حالك؟',       true),
  ('شُكراً',   'thank you',      'شُكراً جزيلاً',             true),
  ('كَلَّمَ',   'to speak',       'كَلَّمَ صَدِيقَهُ',          false),
  ('فَهِمَ',    'to understand',  'هَل فَهِمتَ؟',              false),
  ('أَكَلَ',    'to eat',         'أَكَلَ الطَّعَام',           false),
  ('شَرِبَ',    'to drink',       'شَرِبَ مَاءً',              false),
  ('ذَهَبَ',    'to go',          'ذَهَبَ إلى المَدرَسَة',      false),
  ('جَاءَ',     'to come',        'جَاءَ مِن بَعيد',           false),
  ('أَحَبَّ',   'to love / like', 'أُحِبُّ العَرَبِيَّة',       false),
  ('أَرَادَ',   'to want',        'أُريدُ قَهوَة مِن فَضلِك',  false)
on conflict do nothing;

insert into pattern_rules (rule, examples) values
  ('Words ending in "-al" are the same in Arabic', 'natural · liberal · ideal · cultural · colonial')
on conflict do nothing;
