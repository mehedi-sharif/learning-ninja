import { supabase } from '@/lib/supabase'
import LogScreen from '@/components/screens/LogScreen'

export default async function LogPage() {
  const [
    { data: sessions = [] },
    { data: wins     = [] },
    { data: keywords = [] },
    { data: tasks    = [] },
  ] = await Promise.all([
    supabase.from('feedback_sessions').select('*').order('created_at', { ascending: false }),
    supabase.from('wins').select('*').order('created_at', { ascending: false }),
    supabase.from('keywords').select('*'),
    supabase.from('shame_tasks').select('*'),
  ])

  return (
    <LogScreen
      sessions={sessions ?? []}
      wins={wins ?? []}
      keywords={keywords ?? []}
      tasks={tasks ?? []}
    />
  )
}
