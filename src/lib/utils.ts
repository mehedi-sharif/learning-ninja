import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function xpToLevel(xp: number): { level: number; progress: number; next: number } {
  const level = Math.floor(xp / 500) + 1
  const progress = xp % 500
  const next = 500
  return { level, progress, next }
}

export function motivationLabel(xp: number): string {
  const segs = Math.floor((xp % 500) / 50)
  if (segs >= 8) return 'On fire 🔥'
  if (segs >= 5) return 'Momentum'
  if (segs >= 3) return 'Building'
  return 'Just started'
}
