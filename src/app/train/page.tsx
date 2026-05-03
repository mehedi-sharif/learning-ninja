import { supabase } from '@/lib/supabase'
import TrainScreen from '@/components/screens/TrainScreen'

export default async function TrainPage() {
  const [
    { data: keywords = [] },
    { data: patterns = [] },
  ] = await Promise.all([
    supabase.from('keywords').select('*').order('created_at'),
    supabase.from('pattern_rules').select('*').order('created_at'),
  ])

  return (
    <TrainScreen
      keywords={keywords ?? []}
      patterns={patterns ?? []}
    />
  )
}
