'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

type Bill = {
  id: string
  type: 'luce' | 'gas' | 'acqua'
  month: number
  year: number
  amount_eur: number
  kwh: number | null
}

type Props = { bills: Bill[] }

const MONTHS = ['Gen','Feb','Mar','Apr','Mag','Giu',
                'Lug','Ago','Set','Ott','Nov','Dic']

const UTILITY = {
  luce:  { label: 'Luce',  icon: 'bolt',                  color: '#f59e0b' },
  gas:   { label: 'Gas',   icon: 'local_fire_department',  color: '#f97316' },
  acqua: { label: 'Acqua', icon: 'water_drop',             color: '#3b82f6' },
} as const

export default function BollettaTable({ bills: initialBills }: Props) {
  const [bills, setBills] = useState(initialBills)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

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
    setBills((prev) => prev.filter((b) => b.id !== id))
  }

  if (bills.length === 0) {
    return (
      <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-10 text-center">
        <p className="text-[#bbcabf] text-sm mb-4">Nessuna bolletta trovata.</p>
        
        <a
          href="/inserisci"
          className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Inserisci la prima bolletta
        </a>
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
                  </td>
                  <td className="px-6 py-3.5 text-[#dde2f3] font-medium">
                    € {b.amount_eur.toFixed(2)}
                  </td>
                  <td className="px-6 py-3.5 text-[#bbcabf]">
                    {b.kwh ? `${b.kwh} kWh` : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      <a
                        href={`/bollette/${b.id}`}
                        className="p-1.5 rounded-lg text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#4edea3]/10 transition-colors"
                        title="Modifica"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </a>
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