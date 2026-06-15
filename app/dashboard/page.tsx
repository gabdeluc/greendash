import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-servers'
import Sidebar from '@/components/ui/Sidebar'
import SparklineChart from '@/components/charts/SparklineChart'
import SuggestionCard from '@/components/ui/SuggestionCard'
import { getProjections } from '@/lib/projections'
import { getSuggestions } from '@/lib/suggestion'

type Bill = {
  id: string; type: string; month: number
  year: number; amount_eur: number; kwh: number | null
}

const UTILITY = {
  luce:  { label: 'Electricity', icon: 'bolt',      color: '#f59e0b', unit: 'kWh' },
  gas:   { label: 'Gas',         icon: 'local_fire_department', color: '#f97316', unit: 'Sm³' },
  acqua: { label: 'Water',       icon: 'water_drop', color: '#3b82f6', unit: 'm³'  },
} as const

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data } = await supabase
    .from('bills').select('*')
    .order('year', { ascending: true })
    .order('month', { ascending: true })

  // FIX: Aggiunto tipo esplicito (b: any)
  const bills: Bill[] = (data ?? []).map((b: any) => ({
    id: b.id, type: b.type,
    month: Number(b.month), year: Number(b.year),
    amount_eur: Number(b.amount_eur),
    kwh: b.kwh ? Number(b.kwh) : null,
  }))

  // KPI per utility
  function getKpi(type: string) {
    const typeBills = bills.filter(b => b.type === type).slice(-6)
    const last = typeBills[typeBills.length - 1]
    const prev = typeBills[typeBills.length - 2]
    const value = last ? (type === 'luce' && last.kwh ? last.kwh : last.amount_eur) : 0
    const prevValue = prev ? (type === 'luce' && prev.kwh ? prev.kwh : prev.amount_eur) : 0
    const trend = prevValue > 0 ? ((value - prevValue) / prevValue) * 100 : 0
    const spark = typeBills.map(b => ({
      value: type === 'luce' && b.kwh ? b.kwh : b.amount_eur,
    }))
    return { value, trend, spark }
  }

  // Projections totals (sum of next 3 months)
  function getProjectionTotal(type: string) {
    const proj = getProjections(bills, type)
    return proj.filter((p: any) => p.isProjection).reduce((s: number, p: any) => s + p.value, 0)
  }

  const projTotals = {
    luce:  getProjectionTotal('luce'),
    gas:   getProjectionTotal('gas'),
    acqua: getProjectionTotal('acqua'),
  }
  const maxProj = Math.max(...Object.values(projTotals), 1)
  const suggestions = getSuggestions(bills)

  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3]">
      <Sidebar email={session.user.email ?? ''} />

      <div className="ml-[240px] min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#3c4a42] bg-[#0e131f] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              energy_savings_leaf
            </span>
            <span className="text-[#4edea3] font-semibold text-lg tracking-tight">GreenDash</span>
          </div>
          
          {/* FIX: Aggiunta apertura tag <a */}
          <a
            href="/inserisci"
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Bill
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 max-w-[1280px] w-full">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Overview</h1>
          <p className="text-[#bbcabf] text-sm mb-8">Current utility consumption and projections.</p>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {(['luce', 'gas', 'acqua'] as const).map(type => {
              const u = UTILITY[type]
              const { value, trend, spark } = getKpi(type)
              const trendUp = trend > 0
              return (
                <div key={type} className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${u.color}20` }}>
                        <span className="material-symbols-outlined text-[16px]"
                          style={{ color: u.color, fontVariationSettings: "'FILL' 1" }}>
                          {u.icon}
                        </span>
                      </div>
                      <span className="text-[#bbcabf] text-xs font-semibold uppercase tracking-wider">
                        {u.label}
                      </span>
                    </div>
                    {bills.length > 0 && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${trendUp
                          ? 'text-red-400 bg-red-400/10'
                          : 'text-[#4edea3] bg-[#4edea3]/10'}`}>
                        {trendUp ? '+' : ''}{trend.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-3xl font-bold tracking-tight">
                      {value > 0 ? value.toFixed(0) : '—'}
                    </span>
                    {value > 0 && (
                      <span className="text-[#bbcabf] text-sm">{u.unit}</span>
                    )}
                  </div>
                  {spark.length > 1 && (
                    <SparklineChart data={spark} color={u.color} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Charts + Projections */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Consumption chart */}
            <div className="col-span-2 bg-[#1a202c] border border-[#3c4a42] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-[#dde2f3]">Consumption Trends</h2>
                <div className="flex items-center gap-4 text-xs text-[#bbcabf]">
                  {(['luce', 'gas', 'acqua'] as const).map(t => (
                    <span key={t} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block"
                        style={{ background: UTILITY[t].color }} />
                      {UTILITY[t].label}
                    </span>
                  ))}
                </div>
              </div>
              {/* Import ConsumptionChart */}
              <ConsumptionChartWrapper bills={bills} />
            </div>

            {/* Projections */}
            <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-6">
              <h2 className="font-semibold text-[#dde2f3] mb-1">3-Month Projections</h2>
              <p className="text-[#bbcabf] text-xs mb-6">Estimated Q3 totals</p>
              <div className="space-y-6">
                {(['luce', 'gas', 'acqua'] as const).map(type => {
                  const u = UTILITY[type]
                  const total = projTotals[type]
                  const pct = maxProj > 0 ? (total / maxProj) * 100 : 0
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]"
                            style={{ color: u.color, fontVariationSettings: "'FILL' 1" }}>
                            {u.icon}
                          </span>
                          <span className="text-sm text-[#dde2f3]">{u.label}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#dde2f3]">
                            € {total > 0 ? total.toFixed(2) : '—'}
                          </p>
                          <p className="text-[10px] text-[#bbcabf]">Est. Q3 Total</p>
                        </div>
                      </div>
                      <div className="h-1 bg-[#242a36] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: u.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* AI Insights */}
              <div className="mt-8">
                <h2 className="font-semibold text-[#dde2f3] mb-4">AI Insights vs National Avg</h2>
                <div className="space-y-3">
                  {/* FIX: Aggiunti i tipi espliciti s: any e i: number */}
                  {suggestions.map((s: any, i: number) => (
                    <SuggestionCard key={i} type={s.type} title={s.title} body={s.body} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Wrapper per ConsumptionChart (client component)
import ConsumptionChartInner from '@/components/charts/ConsumptionChart'

function ConsumptionChartWrapper({ bills }: { bills: Bill[] }) {
  return <ConsumptionChartInner bills={bills} />
}