'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { UtilityType } from '@/lib/averages'

type Bill = {
  id: string
  type: UtilityType
  month: number
  year: number
  amount_eur: number
  kwh: number | null
  months_covered: number
}

type Props = { bills: Bill[] }

const MONTHS = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']

const UTILITY = {
  luce:     { label: 'Luce',     icon: 'bolt',                  color: '#f59e0b' },
  gas:      { label: 'Gas',      icon: 'local_fire_department', color: '#f97316' },
  acqua:    { label: 'Acqua',    icon: 'water_drop',            color: '#3b82f6' },
  telefono: { label: 'Telefono', icon: 'call',                  color: '#a78bfa' },
} as const

const FREQUENCY_LABEL: Record<number, string> = {
  1: 'Mensile', 2: 'Bimestrale', 3: 'Trimestrale', 4: 'Quadrimestrale',
}

export default function BollettaTable({ bills: initialBills }: Props) {
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Calcolato direttamente nel render, niente useEffect+setState: la fonte
  // di verità resta la prop bills, qui togliamo solo le righe eliminate in
  // questa sessione, per un feedback immediato senza aspettare il refresh.
  const bills = initialBills.filter((b) => !deletedIds.has(b.id))

  async function handleDelete(id: string) {
    const ok = window.confirm("Vuoi davvero eliminare questa bolletta? L'azione non è reversibile.")
    if (!ok) return

    setDeletingId(id)
    const { error } = await supabase.from('bills').delete().eq('id', id)
    setDeletingId(null)

    if (error) {
      alert('Errore durante l\'eliminazione: ' + error.message)
      return
    }
    setDeletedIds((prev) => new Set(prev).add(id))
  }

  async function handleSeed() {
    setSeeding(true)
    const res = await fetch('/inserisci/seed', { method: 'POST' })
    setSeeding(false)
    if (res.ok) router.refresh()
    else alert('Errore durante il caricamento dei dati demo.')
  }

  if (bills.length === 0) {
    return (
      <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-10 text-center">
        <p className="text-[#bbcabf] text-sm mb-4">Nessuna bolletta trovata.</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/inserisci"
            className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Inserisci la prima bolletta
          </Link>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 border border-[#3c4a42] text-[#bbcabf] hover:text-[#dde2f3] hover:border-[#86948a] text-sm font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            {seeding ? 'Caricamento...' : 'Carica dati demo'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3c4a42] text-left text-[#bbcabf] text-[11px] uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Utenza</th>
              <th className="px-6 py-3 font-semibold">Periodo</th>
              <th className="px-6 py-3 font-semibold">Importo</th>
              <th className="px-6 py-3 font-semibold">Consumo</th>
              <th className="px-6 py-3 font-semibold text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => {
              const u = UTILITY[b.type]
              return (
                <tr key={b.id} className="border-b border-[#3c4a42] last:border-0 hover:bg-[#242a36] transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px]"
                        style={{ color: u.color, fontVariationSettings: "'FILL' 1" }}>
                        {u.icon}
                      </span>
                      <span className="text-[#dde2f3] font-medium">{u.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-[#bbcabf]">
                    {MONTHS[b.month - 1]} {b.year}
                    {b.months_covered > 1 && (
                      <span className="block text-[10px] text-[#bbcabf]/70 mt-0.5">
                        {FREQUENCY_LABEL[b.months_covered] ?? `${b.months_covered} mesi`}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-[#dde2f3] font-medium">
                    € {b.amount_eur.toFixed(2)}
                  </td>
                  <td className="px-6 py-3.5 text-[#bbcabf]">
                    {b.kwh ? `${b.kwh} kWh` : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/bollette/${b.id}`}
                        className="p-1.5 rounded-lg text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#4edea3]/10 transition-colors"
                        title="Modifica"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(b.id)}
                        disabled={deletingId === b.id}
                        className="p-1.5 rounded-lg text-[#bbcabf] hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                        title="Elimina"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {deletingId === b.id ? 'progress_activity' : 'delete'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}