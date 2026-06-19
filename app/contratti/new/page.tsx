import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-servers'
import Sidebar from '@/components/ui/Sidebar'
import ContrattoForm from '@/components/contratti/ContrattoForm'

type Props = { searchParams: Promise<{ type?: string }> }

export default async function NuovoContrattoPage({ searchParams }: Props) {
  const { type } = await searchParams
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Nuovo Contratto</h1>
          <p className="text-[#bbcabf] text-sm mb-8">
            Registra fornitore, tariffa e scadenza per un&apos;utenza.
          </p>
          <ContrattoForm defaultType={type ?? 'luce'} />
        </main>
      </div>
    </div>
  )
}