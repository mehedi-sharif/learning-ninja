import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser / client-component singleton
export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Typed fetch helpers ──────────────────────────────────────────────────

export async function fetchAll() {
  const [
    { data: teachers  = [] },
    { data: keywords  = [] },
    { data: patterns  = [] },
    { data: tasks     = [] },
    { data: wins      = [] },
    { data: sessions  = [] },
  ] = await Promise.all([
    supabase.from('teachers').select('*').order('created_at'),
    supabase.from('keywords').select('*').order('created_at'),
    supabase.from('pattern_rules').select('*').order('created_at'),
    supabase.from('shame_tasks').select('*').order('created_at'),
    supabase.from('wins').select('*').order('created_at', { ascending: false }),
    supabase.from('feedback_sessions').select('*').order('created_at', { ascending: false }),
  ])
  return { teachers, keywords, patterns, tasks, wins, sessions }
}
