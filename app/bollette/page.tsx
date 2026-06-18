import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-servers'
import Sidebar from '@/components/ui/Sidebar'
import BollettaTable from '@/components/bollette/BollettaTable'
import type { BillRow } from '@/lib/types'

export default async function BollettePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('bills')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  const bills = (data ?? []).map((b: BillRow) => ({
    id: b.id,
    type: b.type,
    month: Number(b.month),
    year: Number(b.year),
    amount_eur: Number(b.amount_eur),
    kwh: b.kwh ? Number(b.kwh) : null,
    months_covered: Number(b.months_covered ?? 1),
  }))

  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3]">
      <Sidebar email={user.email ?? ''} />

      <div className="ml-[240px] min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#3c4a42] bg-[#0e131f] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              energy_savings_leaf
            </span>
            <span className="text-[#4edea3] font-semibold text-lg tracking-tight">GreenDash</span>
          </div>
          <Link
            href="/inserisci"
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Bill
          </Link>
        </header>

        <main className="flex-1 p-8 max-w-[1280px] w-full">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Le tue bollette</h1>
          <p className="text-[#bbcabf] text-sm mb-8">
            Modifica o elimina una bolletta già inserita.
          </p>

          <BollettaTable bills={bills} />
        </main>
      </div>
    </div>
  )
}