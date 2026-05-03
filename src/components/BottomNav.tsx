'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Star, Users, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/',        label: 'Quest',   Icon: Home      },
  { href: '/train',   label: 'Train',   Icon: BookOpen  },
  { href: '/bosses',  label: 'Bosses',  Icon: Star      },
  { href: '/party',   label: 'Party',   Icon: Users     },
  { href: '/log',     label: 'Log',     Icon: BarChart2 },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="flex border-t border-gray-100 bg-white pb-safe">
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2 rounded-xl mx-0.5 my-1 transition-colors',
              active ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            <span className={cn('text-[10px]', active ? 'font-medium' : '')}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
