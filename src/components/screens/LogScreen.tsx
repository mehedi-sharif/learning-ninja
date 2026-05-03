'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { FeedbackSession, Win, Keyword, ShameTask } from '@/lib/types'
import TopBar from '@/components/ui/TopBar'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type Props = {
  sessions: FeedbackSession[]
  wins: Win[]
  keywords: Keyword[]
  tasks: ShameTask[]
}

export default function LogScreen({ sessions: initialSessions, wins: initialWins, keywords, tasks }: Props) {
  const [sessions, setSessions]     = useState(initialSessions)
  const [wins, setWins]             = useState(initialWins)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [showWinForm, setShowWinForm]         = useState(false)

  // Session form state
  const [score, setScore]     = useState(5)
  const [who, setWho]         = useState('')
  const [notes, setNotes]     = useState('')

  // Win form state
  const [winText, setWinText]   = useState('')
  const [isProof, setIsProof]   = useState(false)

  const learnedPct  = keywords.length ? Math.round((keywords.filter(k => k.is_learned).length / keywords.length) * 100) : 0
  const defeatedPct = tasks.length ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0
  const sessionPct  = Math.round((sessions.length / 12) * 100)

  async function handleAddSession(e: React.FormEvent) {
    e.preventDefault()
    const s: FeedbackSession = {
      id: crypto.randomUUID(),
      score,
      who: who.trim() || 'self',
      notes: notes.trim() || null,
      created_at: new Date().toISOString(),
    }
    setSessions(prev => [s, ...prev])
    setScore(5); setWho(''); setNotes('')
    setShowSessionForm(false)
    await supabase.from('feedback_sessions').insert(s)
  }

  async function handleAddWin(e: React.FormEvent) {
    e.preventDefault()
    if (!winText.trim()) return
    const w: Win = {
      id: crypto.randomUUID(),
      description: winText.trim(),
      is_proof: isProof,
      created_at: new Date().toISOString(),
    }
    setWins(prev => [w, ...prev])
    setWinText(''); setIsProof(false)
    setShowWinForm(false)
    await supabase.from('wins').insert(w)
  }

  const proofWins   = wins.filter(w => w.is_proof)
  const regularWins = wins.filter(w => !w.is_proof)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Log · Rules 1 + 4 + 6"
        right={
          <div className="flex gap-1.5">
            <button onClick={() => setShowSessionForm(true)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600 hover:bg-gray-50">+ session</button>
            <button onClick={() => setShowWinForm(true)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600 hover:bg-gray-50">+ win</button>
          </div>
        }
      />

      <div className="scroll-area px-3 py-3 flex flex-col gap-3">

        {/* Goal card */}
        <div className="bg-xp-50 border border-xp-100 rounded-xl p-3.5 text-center">
          <p className="text-2xl font-medium text-xp-700">~6 weeks</p>
          <p className="text-xs text-xp-500 mt-1">to tourist-comfortable Arabic</p>
          <p className="text-[10px] text-xp-400 mt-1.5">at your current pace · keep the streak</p>
        </div>

        {/* Progress bars */}
        <div className="bg-white border border-gray-100 rounded-xl p-3.5">
          <p className="text-sm font-medium text-gray-900 mb-3">Knowledge map</p>
          {[
            { label: 'Keywords mastered', pct: learnedPct, val: `${keywords.filter(k => k.is_learned).length} / ${keywords.length}`, color: 'bg-teal-500' },
            { label: 'Bosses defeated',   pct: defeatedPct, val: `${tasks.filter(t => t.status === 'done').length} / ${tasks.length}`,   color: 'bg-shame-500' },
            { label: 'Feedback sessions', pct: sessionPct,  val: `${sessions.length} / 12`,  color: 'bg-xp-500'   },
          ].map(bar => (
            <div key={bar.label} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600">{bar.label}</span>
                <span className="text-xs text-gray-400">{bar.val}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full transition-all', bar.color)} style={{ width: `${bar.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Feedback sessions — Rule 4 */}
        <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">Feedback sessions · Rule 4</p>
        {sessions.length === 0
          ? <p className="text-xs text-gray-400 px-1">No sessions logged — tap "+ session" after each practice</p>
          : sessions.map(s => (
            <div key={s.id} className="bg-white border border-gray-100 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">With {s.who}</p>
                <Badge variant="teal">{s.score}/5</Badge>
              </div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={cn('w-2.5 h-2.5 rounded-full', i < s.score ? 'bg-teal-500' : 'bg-gray-100')} />
                ))}
              </div>
              {s.notes && <p className="text-xs text-gray-500 leading-relaxed">{s.notes}</p>}
            </div>
          ))
        }

        {/* Wins — Rule 1 */}
        <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">Wins log · Rule 1</p>
        {regularWins.length === 0
          ? <p className="text-xs text-gray-400 px-1">No wins logged — tap "+ win" to capture your first early win</p>
          : regularWins.map(w => (
            <div key={w.id} className="flex gap-2.5 items-start bg-white border border-gray-100 rounded-xl p-3.5">
              <div className="w-6 h-6 rounded-lg bg-xp-50 border border-xp-100 flex items-center justify-center text-xp-500 text-xs shrink-0">★</div>
              <p className="text-xs text-gray-600 flex-1 leading-relaxed">{w.description}</p>
            </div>
          ))
        }

        {/* Identity proof — Rule 6 */}
        {proofWins.length > 0 && (
          <>
            <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">Identity proof · Rule 6</p>
            {proofWins.map(w => (
              <div key={w.id} className="flex gap-2.5 items-start bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-xs shrink-0">★</div>
                <div className="flex-1">
                  <p className="text-xs text-amber-800 leading-relaxed">{w.description}</p>
                  <p className="text-[10px] text-amber-600 mt-0.5">Proof you are already an Arabic speaker</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add session sheet */}
      {showSessionForm && (
        <div className="absolute inset-0 bg-black/30 flex items-end z-50" onClick={() => setShowSessionForm(false)}>
          <div className="bg-white rounded-t-2xl p-5 w-full flex flex-col gap-3 max-h-[90%] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-medium text-gray-900">Log a feedback session · Rule 4</p>
            <p className="text-xs text-gray-400 -mt-2">Immediate feedback is what separates fast learners from slow ones</p>
            <form onSubmit={handleAddSession} className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-2">How well did it go? (1–5)</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setScore(n)} className={cn('flex-1 py-2 border rounded-lg text-sm font-medium transition-colors', n <= score ? 'bg-teal-50 border-teal-300 text-teal-800' : 'border-gray-200 text-gray-400')}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="Who gave you feedback? (name or 'self')" value={who} onChange={e => setWho(e.target.value)} />
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none h-20" placeholder="What worked? What to adjust? (be specific — this is Rule 4)" value={notes} onChange={e => setNotes(e.target.value)} />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowSessionForm(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-600">Cancel</button>
                <button type="submit" className="flex-[2] bg-teal-500 text-white rounded-lg py-2.5 text-sm font-medium">Log session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add win sheet */}
      {showWinForm && (
        <div className="absolute inset-0 bg-black/30 flex items-end z-50" onClick={() => setShowWinForm(false)}>
          <div className="bg-white rounded-t-2xl p-5 w-full flex flex-col gap-3" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-medium text-gray-900">Log a win · Rule 1</p>
            <p className="text-xs text-gray-400 -mt-2">Any positive feedback counts — this is your dopamine fuel</p>
            <form onSubmit={handleAddWin} className="flex flex-col gap-3">
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-teal-400" placeholder="Describe the win (e.g. 'a local understood me')" value={winText} onChange={e => setWinText(e.target.value)} />
              <div>
                <p className="text-xs text-gray-500 mb-2">Is this identity proof? · Rule 6</p>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setIsProof(true)} className={cn('border rounded-lg py-2.5 text-xs transition-colors', isProof ? 'bg-amber-50 border-amber-300 text-amber-800 font-medium' : 'border-gray-200 text-gray-500')}>
                    Yes — proves I'm an Arabic speaker
                  </button>
                  <button type="button" onClick={() => setIsProof(false)} className={cn('border rounded-lg py-2.5 text-xs transition-colors', !isProof ? 'bg-teal-50 border-teal-300 text-teal-800 font-medium' : 'border-gray-200 text-gray-500')}>
                    No — just a regular win
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowWinForm(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-600">Cancel</button>
                <button type="submit" className="flex-[2] bg-teal-500 text-white rounded-lg py-2.5 text-sm font-medium">Log win</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
