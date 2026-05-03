import { supabase } from '@/lib/supabase'
import QuestScreen from '@/components/screens/QuestScreen'

export default async function QuestPage() {
  const [
    { data: keywords  = [] },
    { data: tasks     = [] },
    { data: teachers  = [] },
    { data: wins      = [] },
    { data: sessions  = [] },
  ] = await Promise.all([
    supabase.from('keywords').select('*'),
    supabase.from('shame_tasks').select('*'),
    supabase.from('teachers').select('*'),
    supabase.from('wins').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('feedback_sessions').select('*').order('created_at', { ascending: false }).limit(1),
  ])

  return (
    <QuestScreen
      keywords={keywords ?? []}
      tasks={tasks ?? []}
      teachers={teachers ?? []}
      wins={wins ?? []}
      lastSession={sessions?.[0] ?? null}
    />
  )
}
