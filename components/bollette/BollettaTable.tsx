'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useToast, Toast } from '@/components/ui/Toast'
import type { UtilityType } from '@/lib/averages'
import { UTILITY_CONFIG, UTILITY_TYPES } from '@/lib/utility-config'

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

const MONTHS      = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']
const MONTHS_FULL = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
                     'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']

const FREQUENCY_LABEL: Record<number, string> = {
  1: 'Mensile', 2: 'Bimestrale', 3: 'Trimestrale', 4: 'Quadrimestrale',
}

export default function BollettaTable({ bills: initialBills }: Props) {
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId,  setConfirmId]  = useState<string | null>(null)
  const [filterType, setFilterType] = useState<UtilityType | 'all'>('all')
  const [filterYear, setFilterYear] = useState<number | 'all'>('all')
  const { toast, show } = useToast()
  const supabase = createClient()

  const availableYears = [...new Set(initialBills.map(b => b.year))].sort((a, b) => b - a)

  const bills = initialBills
    .filter(b => !deletedIds.has(b.id))
    .filter(b => filterType === 'all' || b.type === filterType)
    .filter(b => filterYear === 'all' || b.year === filterYear)

  async function handleDelete(id: string) {
    setDeletingId(id)
    setConfirmId(null)
    const { error } = await supabase.from('bills').delete().eq('id', id)
    setDeletingId(null)
    if (error) {
      show('error', 'Errore durante l\'eliminazione: ' + error.message)
      return
    }
    setDeletedIds(prev => new Set(prev).add(id))
    show('success', 'Bolletta eliminata correttamente')
  }

  function exportCSV() {
    const rows = initialBills.filter(b => !deletedIds.has(b.id))
    const headers = ['Tipo', 'Mese', 'Anno', 'Importo (€)', 'Consumo (kWh)', 'Cadenza']
    const body = rows.map(b => [
      UTILITY_CONFIG[b.type].label,
      MONTHS_FULL[b.month - 1],
      b.year,
      b.amount_eur.toFixed(2),
      b.kwh ?? '',
      FREQUENCY_LABEL[b.months_covered] ?? `${b.months_covered} mesi`,
    ])
    const csv = '\uFEFF' + [headers, ...body]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `greendash-bollette-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    show('success', 'CSV esportato correttamente')
  }

  if (initialBills.length === 0) {
    return (
      <>
        <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#242a36] border border-[#3c4a42] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl">receipt_long</span>
          </div>
          <p className="text-[#dde2f3] text-sm font-medium mb-1">Nessuna bolletta registrata</p>
          <p className="text-[#bbcabf] text-xs mb-5">Inizia inserendo la tua prima bolletta per vedere statistiche e proiezioni.</p>
          <Link
            href="/inserisci"
            className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Inserisci la prima bolletta
          </Link>
        </div>
        <Toast toast={toast} />
      </>
    )
  }

  return (
    <>
      <div className="space-y-3">

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                ${filterType === 'all'
                  ? 'bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30'
                  : 'border-[#3c4a42] text-[#bbcabf] hover:text-[#dde2f3] hover:border-[#86948a]'}`}
            >
              Tutti
            </button>
            {UTILITY_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFilterType(filterType === t ? 'all' : t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                  ${filterType === t
                    ? 'border-current'
                    : 'border-[#3c4a42] text-[#bbcabf] hover:text-[#dde2f3] hover:border-[#86948a]'}`}
                style={filterType === t
                  ? { color: UTILITY_CONFIG[t].color, background: `${UTILITY_CONFIG[t].color}15` }
                  : {}}
              >
                {UTILITY_CONFIG[t].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterYear}
              onChange={e => setFilterYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-[#0e131f] border border-[#3c4a42] rounded-lg px-3 py-1.5 text-[#dde2f3] text-xs focus:outline-none focus:border-[#4edea3] transition-colors appearance-none"
            >
              <option value="all">Tutti gli anni</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3c4a42] text-[#bbcabf] hover:text-[#4edea3] hover:border-[#4edea3]/30 text-xs font-semibold transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {bills.length === 0 ? (
          <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-8 text-center">
            <p className="text-[#bbcabf] text-sm">Nessuna bolletta corrisponde ai filtri selezionati.</p>
            <button
              onClick={() => { setFilterType('all'); setFilterYear('all') }}
              className="mt-3 text-xs text-[#4edea3] hover:underline"
            >
              Azzera filtri
            </button>
          </div>
        ) : (
          <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl overflow-hidden">
            <div className="px-6 py-3 border-b border-[#3c4a42]">
              <p className="text-[#bbcabf] text-xs">
                {bills.length} bollett{bills.length === 1 ? 'a' : 'e'}
                {(filterType !== 'all' || filterYear !== 'all') && ' — filtrate'}
              </p>
            </div>
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
                  {bills.map(b => {
                    const u = UTILITY_CONFIG[b.type]
                    const isConfirming = confirmId === b.id
                    return (
                      <tr key={b.id}
                        className="border-b border-[#3c4a42] last:border-0 hover:bg-[#242a36] transition-colors">
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
                            {isConfirming ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-[#bbcabf]">Sicuro?</span>
                                <button
                                  onClick={() => handleDelete(b.id)}
                                  disabled={deletingId === b.id}
                                  className="px-2 py-1 rounded text-[11px] font-semibold text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors disabled:opacity-50"
                                >
                                  {deletingId === b.id ? '...' : 'Sì'}
                                </button>
                                <button
                                  onClick={() => setConfirmId(null)}
                                  className="px-2 py-1 rounded text-[11px] font-semibold text-[#bbcabf] hover:text-[#dde2f3] transition-colors"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <>
                                <Link
                                  href={`/bollette/${b.id}`}
                                  className="p-1.5 rounded-lg text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#4edea3]/10 transition-colors"
                                  title="Modifica"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </Link>
                                <button
                                  onClick={() => setConfirmId(b.id)}
                                  className="p-1.5 rounded-lg text-[#bbcabf] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                  title="Elimina"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Toast toast={toast} />
    </>
  )
}