import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-servers'
import Sidebar from '@/components/ui/Sidebar'
import ContrattoForm from '@/components/contratti/ContrattoForm'
import type { ContractRow } from '@/lib/types'

type Props = { params: Promise<{ id: string }> }

export default async function EditContrattoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('contracts')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) redirect('/contratti')

  const c = data as ContractRow

  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3]">
      <Sidebar email={user.email ?? ''} />

      <div className="ml-[240px] min-h-screen flex flex-col">
        <header className="flex items-center px-8 py-4 border-b border-[#3c4a42] sticky top-0 bg-[#0e131f] z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              energy_savings_leaf
            </span>
            <span className="text-[#4edea3] font-semibold text-lg tracking-tight">GreenDash</span>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[680px]">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Modifica Contratto</h1>
          <p className="text-[#bbcabf] text-sm mb-8">Aggiorna i dati del contratto.</p>
          <ContrattoForm initial={{
            id:              c.id,
            type:            c.type,
            provider_name:   c.provider_name,
            tariff_name:     c.tariff_name     ?? '',
            activation_date: c.activation_date ?? '',
            renewal_date:    c.renewal_date    ?? '',
            monthly_eur:     c.monthly_eur ? String(c.monthly_eur) : '',
            notes:           c.notes           ?? '',
          }} />
        </main>
      </div>
    </div>
  )
}