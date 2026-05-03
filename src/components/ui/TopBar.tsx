import { cn } from '@/lib/utils'

type Props = {
  title: string
  right?: React.ReactNode
  className?: string
}

export default function TopBar({ title, right, className }: Props) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0', className)}>
      <span className="text-sm font-medium text-gray-900">{title}</span>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  )
}
