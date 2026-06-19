import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-servers'
import Sidebar from '@/components/ui/Sidebar'
import type { ContractRow } from '@/lib/types'
import type { UtilityType } from '@/lib/averages'

type Contract = {
  id: string
  type: UtilityType
  provider_name: string
  tariff_name: string | null
  activation_date: string | null
  renewal_date: string | null
  monthly_eur: number | null
  notes: string | null
}

const UTILITY: Record<UtilityType, { label: string; icon: string; color: string }> = {
  luce:     { label: 'Luce',     icon: 'bolt',                  color: '#f59e0b' },
  gas:      { label: 'Gas',      icon: 'local_fire_department', color: '#f97316' },
  acqua:    { label: 'Acqua',    icon: 'water_drop',            color: '#3b82f6' },
  telefono: { label: 'Telefono', icon: 'call',                  color: '#a78bfa' },
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function getRenewalBadge(renewalDate: string | null) {
  if (!renewalDate) return null
  const daysLeft = Math.ceil(
    (new Date(renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  if (daysLeft < 0)  return { label: 'Scaduto',          color: 'text-red-400',    bg: 'bg-red-400/10'    }
  if (daysLeft <= 30) return { label: `${daysLeft} giorni`, color: 'text-amber-400', bg: 'bg-amber-400/10'  }
  return               { label: formatDate(renewalDate), color: 'text-[#4edea3]',  bg: 'bg-[#4edea3]/10'  }
}

const TYPES: UtilityType[] = ['luce', 'gas', 'acqua', 'telefono']

export default async function ContrattiPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false })

  const contracts: Contract[] = (data ?? []).map((c: ContractRow) => ({
    id:              c.id,
    type:            c.type,
    provider_name:   c.provider_name,
    tariff_name:     c.tariff_name,
    activation_date: c.activation_date,
    renewal_date:    c.renewal_date,
    monthly_eur:     c.monthly_eur ? Number(c.monthly_eur) : null,
    notes:           c.notes,
  }))

  // Teniamo il contratto più recente per tipo (la query è già DESC created_at)
  const byType: Record<UtilityType, Contract | null> = {
    luce:     contracts.find(c => c.type === 'luce')     ?? null,
    gas:      contracts.find(c => c.type === 'gas')      ?? null,
    acqua:    contracts.find(c => c.type === 'acqua')    ?? null,
    telefono: contracts.find(c => c.type === 'telefono') ?? null,
  }

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
            href="/contratti/new"
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuovo Contratto
          </Link>
        </header>

        <main className="flex-1 p-8 max-w-[1280px] w-full">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Contratti</h1>
          <p className="text-[#bbcabf] text-sm mb-8">
            Fornitore, tariffa e data di rinnovo per ogni utenza.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {TYPES.map(type => {
              const u        = UTILITY[type]
              const contract = byType[type]
              const badge    = contract ? getRenewalBadge(contract.renewal_date) : null

              return (
                <div key={type} className="bg-[#1a202c] border border-[#3c4a42] rounded-xl overflow-hidden">

                  {/* Header colorato */}
                  <div
                    className="flex items-center justify-between px-5 py-3 border-b border-[#3c4a42]"
                    style={{ background: `${u.color}0d` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]"
                        style={{ color: u.color, fontVariationSettings: "'FILL' 1" }}>
                        {u.icon}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: u.color }}>
                        {u.label}
                      </span>
                    </div>
                    {contract ? (
                      <Link
                        href={`/contratti/${contract.id}`}
                        className="flex items-center gap-1 text-xs text-[#bbcabf] hover:text-[#4edea3] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Modifica
                      </Link>
                    ) : (
                      <Link
                        href={`/contratti/new?type=${type}`}
                        className="flex items-center gap-1 text-xs text-[#bbcabf] hover:text-[#4edea3] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        Aggiungi
                      </Link>
                    )}
                  </div>

                  {/* Body */}
                  {contract ? (
                    <div className="p-5 space-y-4">
                      <div>
                        <p className="text-xl font-semibold text-[#dde2f3]">
                          {contract.provider_name}
                        </p>
                        {contract.tariff_name && (
                          <p className="text-[#bbcabf] text-sm mt-0.5">{contract.tariff_name}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[#bbcabf] text-[10px] uppercase tracking-wider mb-1">
                            Attivazione
                          </p>
                          <p className="text-sm text-[#dde2f3]">
                            {formatDate(contract.activation_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#bbcabf] text-[10px] uppercase tracking-wider mb-1">
                            Rinnovo
                          </p>
                          {badge ? (
                            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color} ${badge.bg}`}>
                              {badge.label}
                            </span>
                          ) : (
                            <p className="text-sm text-[#bbcabf]">—</p>
                          )}
                        </div>
                        {contract.monthly_eur !== null && (
                          <div>
                            <p className="text-[#bbcabf] text-[10px] uppercase tracking-wider mb-1">
                              Costo Stimato
                            </p>
                            <p className="text-sm text-[#dde2f3]">
                              € {contract.monthly_eur.toFixed(2)}/mese
                            </p>
                          </div>
                        )}
                      </div>

                      {contract.notes && (
                        <p className="text-[#bbcabf] text-xs leading-relaxed border-t border-[#3c4a42] pt-3">
                          {contract.notes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 flex flex-col items-center justify-center text-center h-[140px]">
                      <p className="text-[#bbcabf] text-sm mb-3">Nessun contratto registrato</p>
                      <Link
                        href={`/contratti/new?type=${type}`}
                        className="inline-flex items-center gap-1.5 text-sm text-[#4edea3] hover:text-[#6ffbbe] font-medium transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        Aggiungi contratto
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}