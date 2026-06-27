import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-servers'
import Sidebar from '@/components/ui/Sidebar'
import BudgetSettings from '@/components/impostazioni/BudgetImpostazioni'
import type { BudgetRow } from '@/lib/types'
import type { UtilityType } from '@/lib/averages'

export default async function ImpostazioniPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('budgets')
    .select('type, monthly_eur')

  const budgets: Record<UtilityType, number> = { luce: 0, gas: 0, acqua: 0, telefono: 0 }
  ;(data ?? []).forEach((b: BudgetRow) => {
    budgets[b.type] = Number(b.monthly_eur)
  })

  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3]">
      <Sidebar email={user.email ?? ''} />

      <div className="ml-[240px] min-h-screen flex flex-col">
        <header className="flex items-center px-8 py-4 border-b border-[#3c4a42] bg-[#0e131f] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              energy_savings_leaf
            </span>
            <span className="text-[#4edea3] font-semibold text-lg tracking-tight">GreenDash</span>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[680px]">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Impostazioni</h1>
          <p className="text-[#bbcabf] text-sm mb-8">
            Configura i parametri del tuo account.
          </p>

          <section>
            <h2 className="text-base font-semibold text-[#dde2f3] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#4edea3]">savings</span>
              Budget Mensile per Utenza
            </h2>
            <BudgetSettings budgets={budgets} />
          </section>
        </main>
      </div>
    </div>
  )
}