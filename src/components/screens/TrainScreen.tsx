'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Keyword, PatternRule } from '@/lib/types'
import TopBar from '@/components/ui/TopBar'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type Props = { keywords: Keyword[]; patterns: PatternRule[] }

const RATINGS = [
  { label: 'Again', xp: 5,  color: 'border-red-200 text-red-800',     xpColor: 'text-shame-500'  },
  { label: 'Hard',  xp: 10, color: 'border-amber-200 text-amber-800', xpColor: 'text-amber-500' },
  { label: 'Good',  xp: 15, color: 'border-teal-200 text-teal-800',   xpColor: 'text-teal-500'  },
  { label: 'Easy',  xp: 20, color: 'border-blue-200 text-blue-800',   xpColor: 'text-blue-500'  },
]

export default function TrainScreen({ keywords: initial, patterns: initialPatterns }: Props) {
  const [keywords, setKeywords]   = useState(initial)
  const [patterns, setPatterns]   = useState(initialPatterns)
  const [ci, setCi]               = useState(0)
  const [revealed, setRevealed]   = useState(false)
  const [sessionXP, setSessionXP] = useState(0)
  const [activeTab, setActiveTab] = useState<'words' | 'patterns'>('words')
  const [xpFlash, setXpFlash]     = useState('')
  const [showWordForm, setShowWordForm]       = useState(false)
  const [showPatternForm, setShowPatternForm] = useState(false)

  // Add word form state
  const [newWord, setNewWord]   = useState('')
  const [newTrans, setNewTrans] = useState('')
  const [newEx, setNewEx]       = useState('')

  // Add pattern form state
  const [newRule, setNewRule]     = useState('')
  const [newExamples, setNewExamples] = useState('')

  const card = keywords[ci % Math.max(1, keywords.length)]

  function reveal() {
    if (!keywords.length || revealed) return
    setRevealed(true)
  }

  function rate(xp: number) {
    if (xp >= 15 && card) {
      setKeywords(prev => prev.map(k => k.id === card.id ? { ...k, is_learned: true } : k))
      supabase.from('keywords').update({ is_learned: true }).eq('id', card.id)
    }
    setSessionXP(s => s + xp)
    setXpFlash(`+${xp}`)
    setTimeout(() => setXpFlash(''), 600)
    setCi(c => c + 1)
    setRevealed(false)
  }

  async function handleAddWord(e: React.FormEvent) {
    e.preventDefault()
    if (!newWord.trim() || !newTrans.trim()) return
    const kw: Keyword = {
      id: crypto.randomUUID(),
      word: newWord.trim(),
      translation: newTrans.trim(),
      example: newEx.trim() || null,
      is_learned: false,
      created_at: new Date().toISOString(),
    }
    setKeywords(prev => [...prev, kw])
    setNewWord(''); setNewTrans(''); setNewEx('')
    setShowWordForm(false)
    await supabase.from('keywords').insert(kw)
  }

  async function handleAddPattern(e: React.FormEvent) {
    e.preventDefault()
    if (!newRule.trim()) return
    const p: PatternRule = {
      id: crypto.randomUUID(),
      rule: newRule.trim(),
      examples: newExamples.trim() || null,
      created_at: new Date().toISOString(),
    }
    setPatterns(prev => [...prev, p])
    setNewRule(''); setNewExamples('')
    setShowPatternForm(false)
    await supabase.from('pattern_rules').insert(p)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Train · Rule 3"
        right={
          <div className="flex gap-1.5">
            <button onClick={() => setShowWordForm(true)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600 hover:bg-gray-50">+ word</button>
            <button onClick={() => setShowPatternForm(true)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600 hover:bg-gray-50">+ pattern</button>
          </div>
        }
      />

      <div className="scroll-area px-3 py-3 flex flex-col gap-3">

        {/* Flashcard */}
        <div
          onClick={reveal}
          className="bg-white border border-gray-100 rounded-xl p-6 text-center cursor-pointer min-h-[180px] flex flex-col items-center justify-center gap-2 relative overflow-hidden active:bg-gray-50 transition-colors"
        >
          {keywords.length === 0 ? (
            <p className="text-sm text-gray-400">Add words to start training</p>
          ) : (
            <>
              <p className="arabic text-gray-900">{card?.word}</p>
              {!revealed && <p className="text-xs text-gray-400">tap to reveal · {(ci % keywords.length) + 1} of {keywords.length}</p>}
              {revealed && (
                <>
                  <p className="text-lg font-medium text-teal-700">{card?.translation}</p>
                  {card?.example && <p className="text-xs text-gray-500 direction-rtl">{card.example}</p>}
                </>
              )}
              {xpFlash && (
                <span className="absolute top-4 right-4 text-sm font-medium text-teal-500 animate-bounce">{xpFlash}</span>
              )}
            </>
          )}
        </div>

        {/* Rating buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          {RATINGS.map(r => (
            <button
              key={r.label}
              onClick={() => rate(r.xp)}
              disabled={!revealed || !keywords.length}
              className={cn(
                'border rounded-lg py-2 flex flex-col items-center gap-0.5 transition-colors',
                revealed && keywords.length ? r.color + ' hover:bg-gray-50' : 'border-gray-100 text-gray-300 cursor-not-allowed'
              )}
            >
              <span className="text-[11px]">{r.label}</span>
              <span className={cn('text-[10px] font-medium', revealed ? r.xpColor : 'text-gray-300')}>{r.xp} XP</span>
            </button>
          ))}
        </div>

        {/* Session XP */}
        {sessionXP > 0 && (
          <div className="bg-teal-50 border border-teal-100 rounded-xl px-3.5 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium text-teal-800">Session XP</p>
              <Badge variant="teal">+{sessionXP} XP</Badge>
            </div>
            <div className="h-1.5 bg-teal-200 rounded-full">
              <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${Math.min(100, (sessionXP / 500) * 100)}%` }} />
            </div>
          </div>
        )}

        {/* Words / Patterns tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {(['words', 'patterns'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-1.5 text-xs rounded-lg transition-colors capitalize',
                activeTab === tab ? 'bg-white font-medium text-gray-900 border border-gray-200' : 'text-gray-500'
              )}
            >
              {tab === 'words' ? `Word deck (${keywords.length})` : `Pattern rules (${patterns.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'words' && (
          keywords.length === 0
            ? <p className="text-xs text-gray-400 px-1">No words yet — tap "+ word" to add your first keyword</p>
            : <div className="flex flex-wrap gap-1.5">
                {keywords.map(kw => (
                  <button
                    key={kw.id}
                    title={kw.translation}
                    onClick={() => {
                      setKeywords(prev => prev.map(k => k.id === kw.id ? { ...k, is_learned: !k.is_learned } : k))
                      supabase.from('keywords').update({ is_learned: !kw.is_learned }).eq('id', kw.id)
                    }}
                    className={cn(
                      'text-xs px-2.5 py-1 rounded-full border transition-colors',
                      kw.is_learned ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                    )}
                  >
                    {kw.word}
                  </button>
                ))}
              </div>
        )}

        {activeTab === 'patterns' && (
          <div className="flex flex-col gap-2">
            {/* Default cognate pattern always shown */}
            <div className="bg-white border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-medium text-gray-900 mb-1">Words ending in "-al" are Arabic cognates</p>
              <p className="text-xs text-gray-500">natural · liberal · ideal · cultural · colonial</p>
              <p className="text-[10px] text-xp-500 mt-1.5">Unlocks ~200+ words instantly · Rule 3</p>
            </div>
            {patterns.map(p => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-3">
                <p className="text-xs font-medium text-gray-900 mb-1">{p.rule}</p>
                {p.examples && <p className="text-xs text-gray-500">{p.examples}</p>}
                <p className="text-[10px] text-xp-500 mt-1.5">Custom pattern · Rule 3</p>
              </div>
            ))}
            {patterns.length === 0 && (
              <p className="text-xs text-gray-400 px-1">Add your own 80/20 pattern rules</p>
            )}
          </div>
        )}
      </div>

      {/* Add word sheet */}
      {showWordForm && (
        <Sheet title="Add a keyword · Rule 3" sub="Focus on the 20% that gives 80% of results" onClose={() => setShowWordForm(false)}>
          <form onSubmit={handleAddWord} className="flex flex-col gap-3">
            <Input placeholder="Arabic word (e.g. كَلَّمَ)" value={newWord} onChange={setNewWord} />
            <Input placeholder="Translation (e.g. to speak)" value={newTrans} onChange={setNewTrans} />
            <Input placeholder="Example sentence (optional)" value={newEx} onChange={setNewEx} />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowWordForm(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="flex-[2] bg-teal-500 text-white rounded-lg py-2.5 text-sm font-medium">Add to deck</button>
            </div>
          </form>
        </Sheet>
      )}

      {/* Add pattern sheet */}
      {showPatternForm && (
        <Sheet title="Add a pattern rule · Rule 3" sub="One rule that unlocks many words at once" onClose={() => setShowPatternForm(false)}>
          <form onSubmit={handleAddPattern} className="flex flex-col gap-3">
            <Input placeholder="Pattern (e.g. words ending in -al)" value={newRule} onChange={setNewRule} />
            <Input placeholder="Examples (e.g. natural, liberal, ideal)" value={newExamples} onChange={setNewExamples} />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowPatternForm(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="flex-[2] bg-teal-500 text-white rounded-lg py-2.5 text-sm font-medium">Add pattern</button>
            </div>
          </form>
        </Sheet>
      )}
    </div>
  )
}

function Sheet({ title, sub, onClose, children }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 bg-black/30 flex items-end z-50" onClick={onClose}>
      <div className="bg-white rounded-t-2xl p-5 w-full flex flex-col gap-3" onClick={e => e.stopPropagation()}>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        {sub && <p className="text-xs text-gray-400 -mt-2">{sub}</p>}
        {children}
      </div>
    </div>
  )
}

function Input({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}
