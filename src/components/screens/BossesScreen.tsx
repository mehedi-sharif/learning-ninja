'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ShameTask, Teacher } from '@/lib/types'
import TopBar from '@/components/ui/TopBar'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type Props = { tasks: ShameTask[]; teachers: Teacher[] }

const XP_MAP = { high: 50, mid: 30, low: 20 }
const SHAME_COLORS = {
  high: { card: 'bg-red-50 border-red-200',   badge: 'bg-red-50 text-red-800 border border-red-200',   dot: 'bg-shame-500' },
  mid:  { card: 'bg-amber-50 border-amber-200', badge: 'bg-amber-50 text-amber-800 border border-amber-200', dot: 'bg-amber-400' },
  low:  { card: 'bg-blue-50 border-blue-200',  badge: 'bg-blue-50 text-blue-800 border border-blue-200',  dot: 'bg-blue-400'  },
}

export default function BossesScreen({ tasks: initial, teachers }: Props) {
  const [tasks, setTasks]       = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle]       = useState('')
  const [level, setLevel]       = useState<'high' | 'mid' | 'low'>('high')
  const [witnesses, setWitnesses] = useState<string[]>([])

  async function resolve(id: string, status: 'done' | 'failed') {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    await supabase.from('shame_tasks').update({ status }).eq('id', id)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const task: ShameTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      shame_level: level,
      status: 'pending',
      witness_ids: witnesses,
      due_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    }
    setTasks(prev => [...prev, task])
    setTitle(''); setLevel('high'); setWitnesses([])
    setShowForm(false)
    await supabase.from('shame_tasks').insert(task)
  }

  function toggleWitness(id: string) {
    setWitnesses(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])
  }

  const pending = tasks.filter(t => t.status === 'pending')
  const resolved = tasks.filter(t => t.status !== 'pending')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Commitments · Rule 5"
        right={<button onClick={() => setShowForm(true)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600 hover:bg-gray-50">+ commit</button>}
      />

      <div className="scroll-area px-3 py-3 flex flex-col gap-3">

        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5">
          <p className="text-xs font-medium text-red-900 mb-1">Rule 5 · Courage to regress</p>
          <p className="text-xs text-red-700">Make public commitments that are uncomfortable to fail. Your witnesses see every failure — that social accountability is the mechanism.</p>
        </div>

        {pending.length > 0 && (
          <>
            <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">Active boss battles</p>
            {pending.map(task => {
              const colors = SHAME_COLORS[task.shame_level]
              const taskWitnesses = teachers.filter(t => task.witness_ids.includes(t.id))
              return (
                <div key={task.id} className={cn('border rounded-xl p-3.5', colors.card)}>
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center text-base shrink-0">⚔</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>
                      <p className="text-xs text-red-700 mt-0.5">{task.shame_level.charAt(0).toUpperCase() + task.shame_level.slice(1)} shame · Due {task.due_date ?? 'today'}</p>
                    </div>
                    <Badge variant="purple">+{XP_MAP[task.shame_level]}</Badge>
                  </div>

                  {taskWitnesses.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] text-gray-400">Witnesses:</span>
                      <div className="flex">
                        {taskWitnesses.map((w, i) => (
                          <div key={w.id} className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium border-2 border-white', i > 0 && '-ml-1.5')} style={{ background: '#e1f5ee', color: '#085041' }}>
                            {w.initials}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400">will be notified</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => resolve(task.id, 'done')} className="flex-1 bg-teal-50 border border-teal-200 rounded-lg py-2 text-center">
                      <p className="text-xs font-medium text-teal-800">Mark done ✓</p>
                      <p className="text-[10px] text-teal-600">+{XP_MAP[task.shame_level]} XP</p>
                    </button>
                    <button onClick={() => resolve(task.id, 'failed')} className="flex-1 bg-white border border-red-200 rounded-lg py-2 text-center">
                      <p className="text-xs font-medium text-red-800">Failed ✕</p>
                      <p className="text-[10px] text-red-600">−25 XP · shame point</p>
                    </button>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {pending.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No active commitments</p>
            <p className="text-xs text-gray-300 mt-1">Tap "+ commit" to make a public pledge</p>
          </div>
        )}

        {resolved.length > 0 && (
          <>
            <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">Resolved</p>
            {resolved.map(task => (
              <div key={task.id} className={cn('border rounded-xl p-3.5', task.status === 'done' ? 'bg-teal-50 border-teal-100' : 'bg-gray-50 border-gray-100')}>
                <p className={cn('text-sm font-medium line-through', task.status === 'done' ? 'text-teal-800' : 'text-gray-400')}>{task.title}</p>
                <p className={cn('text-xs mt-1', task.status === 'done' ? 'text-teal-600' : 'text-gray-400')}>
                  {task.status === 'done' ? `Defeated · +${XP_MAP[task.shame_level]} XP` : 'Failed · −25 XP · shame point added'}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add commitment sheet */}
      {showForm && (
        <div className="absolute inset-0 bg-black/30 flex items-end z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl p-5 w-full flex flex-col gap-3 max-h-[90%] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-medium text-gray-900">Make a public commitment · Rule 5</p>
            <p className="text-xs text-gray-400 -mt-2">Make it uncomfortable enough that failing hurts more than doing it</p>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="I commit to…" value={title} onChange={e => setTitle(e.target.value)} />
              <div>
                <p className="text-xs text-gray-500 mb-2">Shame level</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'mid', 'low'] as const).map(l => (
                    <button key={l} type="button" onClick={() => setLevel(l)} className={cn('border rounded-lg py-2 text-xs transition-colors capitalize', level === l ? { high: 'bg-red-50 border-red-300 text-red-800 font-medium', mid: 'bg-amber-50 border-amber-300 text-amber-800 font-medium', low: 'bg-blue-50 border-blue-300 text-blue-800 font-medium' }[l] : 'border-gray-200 text-gray-500')}>
                      {l === 'high' ? 'High shame' : l === 'mid' ? 'Medium' : 'Low'}
                    </button>
                  ))}
                </div>
              </div>
              {teachers.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Witnesses <span className="text-gray-400">(notified if you fail)</span></p>
                  <div className="flex flex-wrap gap-2">
                    {teachers.map(t => (
                      <button key={t.id} type="button" onClick={() => toggleWitness(t.id)} className={cn('border rounded-lg px-3 py-1.5 text-xs transition-colors', witnesses.includes(t.id) ? 'bg-teal-50 border-teal-300 text-teal-800 font-medium' : 'border-gray-200 text-gray-500')}>
                        {t.initials} {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-600">Cancel</button>
                <button type="submit" className="flex-[2] bg-teal-500 text-white rounded-lg py-2.5 text-sm font-medium">Commit publicly</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
