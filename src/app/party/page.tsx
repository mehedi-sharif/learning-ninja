import { supabase } from '@/lib/supabase'
import PartyScreen from '@/components/screens/PartyScreen'

export default async function PartyPage() {
  const { data: teachers = [] } = await supabase
    .from('teachers')
    .select('*')
    .order('created_at')

  return <PartyScreen teachers={teachers ?? []} />
}
