// ─── Core domain types — mirror the Supabase schema ───────────────────────

export type Role = 'teacher' | 'witness' | 'native'
export type ShameLevel = 'high' | 'mid' | 'low'
export type TaskStatus = 'pending' | 'done' | 'failed'

export interface Teacher {
  id: string
  name: string
  role: Role
  strategy: string | null   // Rule 2: their learning method / why you picked them
  initials: string
  created_at: string
}

export interface Keyword {
  id: string
  word: string              // Arabic word
  translation: string
  example: string | null    // Example sentence
  is_learned: boolean
  created_at: string
}

export interface PatternRule {
  id: string
  rule: string              // Rule 3: e.g. "words ending in -al are Arabic cognates"
  examples: string | null   // e.g. "natural, liberal, ideal, cultural"
  created_at: string
}

export interface ShameTask {
  id: string
  title: string
  shame_level: ShameLevel
  status: TaskStatus
  witness_ids: string[]     // references Teacher.id
  due_date: string | null
  created_at: string
}

export interface Win {
  id: string
  description: string
  is_proof: boolean         // Rule 6: does this prove your Arabic identity?
  created_at: string
}

export interface FeedbackSession {
  id: string
  score: number             // 1–5
  who: string               // who gave the feedback
  notes: string | null      // what to adjust — Rule 4
  created_at: string
}

// ─── Composite view type used across screens ──────────────────────────────

export interface AppData {
  teachers: Teacher[]
  keywords: Keyword[]
  patterns: PatternRule[]
  tasks: ShameTask[]
  wins: Win[]
  sessions: FeedbackSession[]
}
