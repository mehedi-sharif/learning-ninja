'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Keyword, ShameTask, Teacher, Win, FeedbackSession } from '@/lib/types'
import { xpToLevel, motivationLabel, cn } from '@/lib/utils'
import TopBar from '@/components/ui/TopBar'
import Badge from '@/components/ui/Badge'

const RULES = [
  { id: 1, text: 'Log an early win — any progress counts',        xp: 10  },
  { id: 2, text: 'Train using your teacher\'s strategy today',    xp: 15  },
  { id: 3, text: 'Hit 10 keywords from the 80/20 deck',           xp: 20  },
  { id: 4, text: 'Log a feedback session after practice',         xp: 15  },
  { id: 5, text: 'Do one uncomfortable Arabic thing',             xp: 20  },
  { id: 6, text: 'Say your identity statement out loud',          xp: 5   },
]

type Props = {
  keywords: Keyword[]
  tasks: ShameTask[]
  teachers: Teacher[]
  wins: Win[]
  lastSession: FeedbackSession | null
}

export default function QuestScreen({ keywords, tasks, teachers, wins, lastSession }: Props) {
  const [xp, setXp]             = useState(340)
  const [checked, setChecked]   = useState<Set<number>>(new Set([1, 2]))
  const { level, progress, next } = xpToLevel(xp)

  const learnedCount  = keywords.filter(k => k.is_learned).length
  const pendingBosses = tasks.filter(t => t.status === 'pending').length
  const xpPct         = Math.round((progress / next) * 100)
  const dpSegs        = Math.min(10, Math.floor(progress / 50))

  function toggleRule(id: number, ruleXp: number) {
    const next = new Set(checked)
    if (next.has(id)) { next.delete(id); setXp(x => x - ruleXp) }
    else              { next.add(id);    setXp(x => x + ruleXp) }
    setChecked(next)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Arabic Learning"
        right={
          <div className="flex gap-1.5">
            <Badge variant="amber">🔥 5</Badge>
            <Badge variant="purple">Lvl {level}</Badge>
          </div>
        }
      />

      <div className="scroll-area px-3 py-3 flex flex-col gap-3">

        {/* Player card */}
        <div className="bg-white border border-gray-100 rounded-xl p-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 border-2 border-teal-500 flex items-center justify-center text-sm font-medium text-teal-700 shrink-0">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Mehedi</p>
              <p className="text-xs text-gray-500">Curious Wanderer · {xp} / 500 XP</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-gray-400 mb-1">Level {level + 1} in {next - progress} XP</p>
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all duration-300" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
          {/* Identity — Rule 6 */}
          <div className="mt-3 bg-xp-50 border border-xp-100 rounded-lg px-3 py-2">
            <p className="text-[10px] text-xp-500 font-medium mb-0.5">Rule 6 · Identity</p>
            <p className="text-xs italic text-xp-700">"I am an Arabic speaker. I'm just building vocabulary."</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: learnedCount,  label: 'words',  color: 'text-teal-600'   },
            { val: pendingBosses, label: 'bosses', color: 'text-shame-500'  },
            { val: teachers.length, label: 'party', color: 'text-xp-500'   },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-2.5 text-center">
              <p className={cn('text-xl font-medium', s.color)}>{s.val}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Dopamine / motivation bar — Rule 1 */}
        <div className="bg-white border border-gray-100 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-900">Motivation · Rule 1</p>
            <Badge variant="teal">{motivationLabel(xp)}</Badge>
          </div>
          <p className="text-xs text-gray-400 mb-2">Each win feeds the dopamine loop — keep going</p>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={cn('flex-1 h-2 rounded-full transition-colors duration-300', i < dpSegs ? 'bg-teal-500' : 'bg-gray-100')} />
            ))}
          </div>
        </div>

        {/* Today's quest */}
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-3.5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-sm font-medium text-teal-800">Today's quest</p>
              <p className="text-xs text-teal-600 mt-0.5">Train 10 words + defeat 1 boss</p>
            </div>
            <Badge variant="purple">+80 XP</Badge>
          </div>
          <div className="h-1.5 bg-teal-200 rounded-full my-2.5">
            <div className="h-full w-[35%] bg-teal-500 rounded-full" />
          </div>
          <a href="/train" className="block w-full text-center text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 active:bg-teal-700 rounded-lg py-2.5 transition-colors">
            Start training →
          </a>
        </div>

        {/* 6-rule checklist */}
        <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">Daily checklist · all 6 rules</p>
        <div className="flex flex-col gap-1.5">
          {RULES.map(rule => {
            const done = checked.has(rule.id)
            return (
              <button
                key={rule.id}
                onClick={() => toggleRule(rule.id, rule.xp)}
                className={cn(
                  'flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg border transition-colors',
                  done ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-100 hover:border-gray-200'
                )}
              >
                <div className={cn(
                  'w-4 h-4 rounded shrink-0 border flex items-center justify-center transition-colors',
                  done ? 'bg-teal-500 border-teal-500' : 'border-gray-300'
                )}>
                  {done && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <span className={cn('text-xs flex-1', done ? 'text-teal-700' : 'text-gray-500')}>
                  Rule {rule.id} · {rule.text}
                </span>
                <span className="text-[10px] font-medium text-xp-500 shrink-0">+{rule.xp}</span>
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}
