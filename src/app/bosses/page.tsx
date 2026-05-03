import { supabase } from '@/lib/supabase'
import BossesScreen from '@/components/screens/BossesScreen'

export default async function BossesPage() {
  const [
    { data: tasks    = [] },
    { data: teachers = [] },
  ] = await Promise.all([
    supabase.from('shame_tasks').select('*').order('created_at'),
    supabase.from('teachers').select('*').order('created_at'),
  ])

  return (
    <BossesScreen
      tasks={tasks ?? []}
      teachers={teachers ?? []}
    />
  )
}
