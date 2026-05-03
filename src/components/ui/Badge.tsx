import { cn } from '@/lib/utils'

const VARIANTS = {
  teal:   'bg-teal-50 text-teal-800 border border-teal-200',
  purple: 'bg-xp-50 text-xp-700 border border-xp-100',
  amber:  'bg-amber-50 text-amber-800 border border-amber-200',
  red:    'bg-red-50 text-red-800 border border-red-200',
  gray:   'bg-gray-100 text-gray-600 border border-gray-200',
}

type Props = {
  variant?: keyof typeof VARIANTS
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'gray', children, className }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium', VARIANTS[variant], className)}>
      {children}
    </span>
  )
}
