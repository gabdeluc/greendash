'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Props = { email: string }

const navItems = [
  { href: '/dashboard', label: 'Dashboard',   icon: 'grid_view'    },
  { href: '/bollette',  label: 'Bollette',    icon: 'list_alt'     },
  { href: '/contratti', label: 'Contratti',   icon: 'assignment'   },
  { href: '/inserisci', label: 'Insert Bill', icon: 'receipt_long' },
]

export default function Sidebar({ email }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#161c28] border-r border-[#3c4a42] flex flex-col z-50">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#3c4a42]">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[#4edea3] text-2xl select-none"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            energy_savings_leaf
          </span>
          <span className="text-[#4edea3] font-semibold text-lg tracking-tight">GreenDash</span>
        </div>
        <p className="text-[#bbcabf] text-xs pl-8">Residential Account</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${active
                  ? 'text-[#4edea3] bg-[#4edea3]/10'
                  : 'text-[#bbcabf] hover:text-[#dde2f3] hover:bg-[#242a36]'
                }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#4edea3] rounded-r" />
              )}
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#3c4a42]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#4edea3]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#4edea3] text-xs font-semibold">
              {email.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-[#bbcabf] text-xs truncate">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#bbcabf] hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign out
        </button>
        <p className="text-[#3c4a42] text-xs mt-4">System Status: Online</p>
      </div>
    </aside>
  )
}