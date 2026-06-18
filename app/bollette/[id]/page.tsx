import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-servers'
import Sidebar from '@/components/ui/Sidebar'
import BillEditForm from '@/components/bollette/BollettaEditForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditBollettaPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bill } = await supabase
    .from('bills')
    .select('*')
    .eq('id', id)
    .single()

  if (!bill) redirect('/bollette')

  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3]">
      <Sidebar email={user.email ?? ''} />

      <div className="ml-[240px] min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#3c4a42] sticky top-0 bg-[#0e131f] z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              energy_savings_leaf
            </span>
            <span className="text-[#4edea3] font-semibold text-lg tracking-tight">GreenDash</span>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[680px]">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Modifica Bolletta</h1>
          <p className="text-[#bbcabf] text-sm mb-8">
            Aggiorna i dati di questa bolletta.
          </p>

          <BillEditForm bill={{
            id: bill.id,
            type: bill.type,
            month: Number(bill.month),
            year: Number(bill.year),
            amount_eur: Number(bill.amount_eur),
            kwh: bill.kwh ? Number(bill.kwh) : null,
            months_covered: Number(bill.months_covered ?? 1),
          }} />
        </main>
      </div>
    </div>
  )
}