'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Teacher, Role } from '@/lib/types'
import TopBar from '@/components/ui/TopBar'
import { cn, getInitials } from '@/lib/utils'

type Props = { teachers: Teacher[] }

const ROLE_STYLES: Record<Role, { badge: string; av: string }> = {
  teacher: { badge: 'bg-teal-50 text-teal-800 border-teal-200',   av: 'bg-teal-50 text-teal-700 border-teal-300'   },
  witness: { badge: 'bg-xp-50 text-xp-700 border-xp-100',         av: 'bg-xp-50 text-xp-700 border-xp-200'         },
  native:  { badge: 'bg-amber-50 text-amber-800 border-amber-200', av: 'bg-amber-50 text-amber-700 border-amber-300' },
}
const ROLE_LABELS: Record<Role, string> = {
  teacher: 'Teacher',
  witness: 'Witness',
  native:  'Native speaker',
}

export default function PartyScreen({ teachers: initial }: Props) {
  const [teachers, setTeachers]   = useState(initial)
  const [showForm, setShowForm]   = useState(false)
  const [name, setName]           = useState('')
  const [role, setRole]           = useState<Role>('teacher')
  const [strategy, setStrategy]   = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const t: Teacher = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role,
      strategy: strategy.trim() || null,
      initials: getInitials(name),
      created_at: new Date().toISOString(),
    }
    setTeachers(prev => [...prev, t])
    setName(''); setRole('teacher'); setStrategy('')
    setShowForm(false)
    await supabase.from('teachers').insert(t)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Party · Rule 2"
        right={<button onClick={() => setShowForm(true)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600 hover:bg-gray-50">+ person</button>}
      />

      <div className="scroll-area px-3 py-3 flex flex-col gap-3">

        <div className="bg-teal-50 border border-teal-100 rounded-xl p-3.5">
          <p className="text-xs font-medium text-teal-900 mb-1">Rule 2 · Right teacher or strategy</p>
          <p className="text-xs text-teal-700">Don't learn from generic experts — find people already where you want to be. Capture their strategy, not just their name.</p>
        </div>

        {teachers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No one added yet</p>
            <p className="text-xs text-gray-300 mt-1">Tap "+ person" to add your first teacher or witness</p>
          </div>
        ) : (
          teachers.map((t, i) => {
            const styles = ROLE_STYLES[t.role]
            return (
              <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-3.5">
                <div className="flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium border-2 shrink-0', styles.av)}>
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ROLE_LABELS[t.role]}</p>
                  </div>
                  <span className={cn('text-[10px] font-medium border rounded-md px-2 py-0.5 shrink-0', styles.badge)}>
                    {ROLE_LABELS[t.role]}
                  </span>
                </div>
                {t.strategy && (
                  <div className="mt-2.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400 mb-0.5 font-medium uppercase tracking-wide">Their strategy</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{t.strategy}</p>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Add person sheet */}
      {showForm && (
        <div className="absolute inset-0 bg-black/30 flex items-end z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl p-5 w-full flex flex-col gap-3" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-medium text-gray-900">Add to your party · Rule 2</p>
            <p className="text-xs text-gray-400 -mt-2">Choose someone already where you want to be</p>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white" value={role} onChange={e => setRole(e.target.value as Role)}>
                <option value="teacher">Teacher — guides your strategy</option>
                <option value="witness">Witness — holds you accountable</option>
                <option value="native">Native speaker — models fluency</option>
              </select>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none h-20"
                placeholder="Their strategy / why you picked them (e.g. 'teaches phrases first, not grammar')"
                value={strategy}
                onChange={e => setStrategy(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-600">Cancel</button>
                <button type="submit" className="flex-[2] bg-teal-500 text-white rounded-lg py-2.5 text-sm font-medium">Add to party</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
