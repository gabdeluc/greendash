import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-servers'
import Sidebar from '@/components/ui/Sidebar'
import AnnualBarChart from '@/components/charts/AnnualBarChart'
import SpendingPieChart from '@/components/charts/SpendingPieChart'
import type { BillRow } from '@/lib/types'
import type { UtilityType } from '@/lib/averages'
import { getProjections } from '@/lib/projections'
import type { ProjectionPoint } from '@/lib/projections'
import ProjectionChartInner from '@/components/charts/ProjectionsChart'

type Bill = {
  type: UtilityType
  year: number
  month: number
  amount_eur: number
  months_covered: number
}

type YearTotals = Record<UtilityType, number>

const TYPES: UtilityType[] = ['luce', 'gas', 'acqua', 'telefono']

const UTILITY: Record<UtilityType, { label: string; icon: string; color: string }> = {
  luce:     { label: 'Luce',     icon: 'bolt',                  color: '#f59e0b' },
  gas:      { label: 'Gas',      icon: 'local_fire_department', color: '#f97316' },
  acqua:    { label: 'Acqua',    icon: 'water_drop',            color: '#3b82f6' },
  telefono: { label: 'Telefono', icon: 'call',                  color: '#a78bfa' },
}

export default async function StatistichePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Prendiamo tutti i campi necessari: year/amount per le stat,
  // month/months_covered per le proiezioni
  const { data } = await supabase
    .from('bills')
    .select('type, year, month, amount_eur, months_covered')
    .order('year', { ascending: true })
    .order('month', { ascending: true })

  const bills: Bill[] = (data ?? []).map((b: BillRow) => ({
    type:           b.type,
    year:           Number(b.year),
    month:          Number(b.month),
    amount_eur:     Number(b.amount_eur),
    months_covered: Number(b.months_covered ?? 1),
  }))

  // ── Totali per anno (bar chart + tabella) ────────────────────────────
  const yearMap: Record<number, YearTotals> = {}
  bills.forEach(b => {
    if (!yearMap[b.year]) yearMap[b.year] = { luce: 0, gas: 0, acqua: 0, telefono: 0 }
    yearMap[b.year][b.type] += b.amount_eur
  })
  const years = Object.keys(yearMap).map(Number).sort()

  const chartData = years.map(y => ({
    year:     String(y),
    luce:     Math.round(yearMap[y].luce     * 100) / 100,
    gas:      Math.round(yearMap[y].gas      * 100) / 100,
    acqua:    Math.round(yearMap[y].acqua    * 100) / 100,
    telefono: Math.round(yearMap[y].telefono * 100) / 100,
  }))

  function yoyChange(year: number, type: UtilityType): number | null {
    const prev = yearMap[year - 1]
    const curr = yearMap[year]
    if (!prev || prev[type] === 0) return null
    return ((curr[type] - prev[type]) / prev[type]) * 100
  }

  // ── Distribuzione spesa (anno più recente) ───────────────────────────
  const lastYear = years[years.length - 1]
  const pieData = lastYear
    ? TYPES.map(t => ({
        name:  UTILITY[t].label,
        value: Math.round(yearMap[lastYear][t] * 100) / 100,
        color: UTILITY[t].color,
      }))
    : []

  // ── Proiezioni per utenza ────────────────────────────────────────────
  const projections = Object.fromEntries(
    TYPES.map(t => [t, getProjections(bills, t)])
  ) as Record<UtilityType, ProjectionPoint[]>

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

        <main className="flex-1 p-8 max-w-[1280px] w-full">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Statistiche Annuali</h1>
          <p className="text-[#bbcabf] text-sm mb-8">
            Spesa per anno, distribuzione per utenza e proiezioni future.
          </p>

          {bills.length === 0 ? (
            <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-10 text-center">
              <p className="text-[#bbcabf] text-sm">
                Nessuna bolletta inserita — le statistiche appariranno qui automaticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {/* ── Bar chart + Pie chart ─────────────────────────────── */}
              <div className="grid grid-cols-3 gap-4">

                {/* Bar chart: spesa totale per anno */}
                <div className="col-span-2 bg-[#1a202c] border border-[#3c4a42] rounded-xl p-6">
                  <h2 className="font-semibold text-[#dde2f3] mb-6">Spesa totale per anno</h2>
                  <AnnualBarChart data={chartData} />
                </div>

                {/* Donut: distribuzione anno corrente */}
                <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-6">
                  <h2 className="font-semibold text-[#dde2f3] mb-1">Distribuzione spesa</h2>
                  <p className="text-[#bbcabf] text-xs mb-4">
                    Ripartizione per utenza nell&apos;anno più recente
                  </p>
                  <SpendingPieChart data={pieData} year={lastYear} />
                </div>
              </div>

              {/* ── Proiezioni per utenza ─────────────────────────────── */}
              <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-6">
                <h2 className="font-semibold text-[#dde2f3] mb-1">
                  Proiezioni prossimi 3 mesi
                </h2>
                <p className="text-[#bbcabf] text-xs mb-6">
                  Stima basata sulla regressione lineare delle bollette precedenti.
                  La linea tratteggiata indica i valori proiettati.
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {TYPES.map(type => {
                    const u = UTILITY[type]
                    return (
                      <div key={type}>
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="material-symbols-outlined text-[17px]"
                            style={{ color: u.color, fontVariationSettings: "'FILL' 1" }}
                          >
                            {u.icon}
                          </span>
                          <span className="text-sm font-semibold text-[#dde2f3]">{u.label}</span>
                        </div>
                        <ProjectionChartWrapper
                          data={projections[type]}
                          color={u.color}
                          label={u.label}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Tabella YoY ───────────────────────────────────────── */}
              <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#3c4a42]">
                  <h2 className="font-semibold text-[#dde2f3]">Dettaglio per anno</h2>
                  <p className="text-[#bbcabf] text-xs mt-0.5">
                    Le frecce indicano la variazione rispetto all&apos;anno precedente
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#3c4a42] text-left text-[#bbcabf] text-[11px] uppercase tracking-wider">
                        <th className="px-6 py-3 font-semibold">Anno</th>
                        {TYPES.map(t => (
                          <th key={t} className="px-6 py-3 font-semibold"
                            style={{ color: UTILITY[t].color }}>
                            {UTILITY[t].label}
                          </th>
                        ))}
                        <th className="px-6 py-3 font-semibold text-[#dde2f3]">Totale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {years.map(year => {
                        const row       = yearMap[year]
                        const total     = TYPES.reduce((s, t) => s + row[t], 0)
                        const prevRow   = yearMap[year - 1]
                        const prevTotal = prevRow
                          ? TYPES.reduce((s, t) => s + prevRow[t], 0)
                          : null
                        const totalChange = prevTotal && prevTotal > 0
                          ? ((total - prevTotal) / prevTotal) * 100
                          : null

                        return (
                          <tr key={year}
                            className="border-b border-[#3c4a42] last:border-0 hover:bg-[#242a36] transition-colors">
                            <td className="px-6 py-4 font-semibold text-[#dde2f3] text-base">
                              {year}
                            </td>

                            {TYPES.map(t => {
                              const val    = row[t]
                              const change = yoyChange(year, t)
                              return (
                                <td key={t} className="px-6 py-4">
                                  <span className="text-[#dde2f3]">
                                    {val > 0 ? `€ ${val.toFixed(2)}` : '—'}
                                  </span>
                                  {change !== null && val > 0 && (
                                    <span className={`ml-2 text-[10px] font-semibold
                                      ${change > 0 ? 'text-red-400' : 'text-[#4edea3]'}`}>
                                      {change > 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
                                    </span>
                                  )}
                                </td>
                              )
                            })}

                            <td className="px-6 py-4">
                              <span className="text-[#dde2f3] font-semibold">
                                € {total.toFixed(2)}
                              </span>
                              {totalChange !== null && (
                                <span className={`ml-2 text-[10px] font-semibold
                                  ${totalChange > 0 ? 'text-red-400' : 'text-[#4edea3]'}`}>
                                  {totalChange > 0 ? '▲' : '▼'} {Math.abs(totalChange).toFixed(1)}%
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Wrapper necessario per usare il client component ProjectionChart
// dall'interno di questo server component
function ProjectionChartWrapper({
  data, color, label,
}: {
  data: ProjectionPoint[]
  color: string
  label: string
}) {
  return <ProjectionChartInner data={data} color={color} label={label} />
}