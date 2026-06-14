import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-servers'
import KpiCard from '@/components/ui/KpiCard'
import ConsumptionChart from '@/components/charts/ConsumptionChart'

type Bill = {
  id: string
  type: string
  month: number
  year: number
  amount_eur: number
  kwh: number | null
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data } = await supabase
    .from('bills')
    .select('*')
    .order('year', { ascending: true })
    .order('month', { ascending: true })

  const bills: Bill[] = (data ?? []).map((b: any) => ({
    id: b.id,
    type: b.type,
    month: Number(b.month),
    year: Number(b.year),
    amount_eur: Number(b.amount_eur),
    kwh: b.kwh ? Number(b.kwh) : null,
  }))

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear

  const thisMonthBills = bills.filter(
    (b) => b.month === currentMonth && b.year === currentYear
  )
  const lastMonthBills = bills.filter(
    (b) => b.month === prevMonth && b.year === prevYear
  )

  const totalThisMonth = thisMonthBills.reduce((s, b) => s + b.amount_eur, 0)
  const totalLastMonth = lastMonthBills.reduce((s, b) => s + b.amount_eur, 0)
  const totalKwh = bills.filter((b) => b.kwh !== null).reduce((s, b) => s + (b.kwh ?? 0), 0)
  const totalAll = bills.reduce((s, b) => s + b.amount_eur, 0)
  const avgMonthly = bills.length > 0 ? (totalAll / 12).toFixed(2) : '0.00'

  let trendLabel = 'Nessun dato precedente'
  let trendDir: 'up' | 'down' | 'neutral' = 'neutral'

  if (totalLastMonth > 0) {
    const diff = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
    const sign = diff > 0 ? '+' : ''
    trendLabel = `${sign}${diff.toFixed(1)}% vs mese scorso`
    trendDir = diff > 0 ? 'up' : 'down'
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-xl">🌱</span>
            <h1 className="text-white font-medium text-lg">GreenDash</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-500 text-sm">{session.user.email}</p>
            
            <a
              href="/inserisci"
              className="bg-green-500 hover:bg-green-400 text-gray-950 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Bolletta
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KpiCard
            label="Questo mese"
            value={`€${totalThisMonth.toFixed(2)}`}
            sub={trendLabel}
            trend={trendDir}
          />
          <KpiCard
            label="kWh totali"
            value={totalKwh > 0 ? `${totalKwh}` : '—'}
            sub="Tutti i periodi"
          />
          <KpiCard
            label="Media mensile"
            value={`€${avgMonthly}`}
            sub="Stima annuale"
          />
          <KpiCard
            label="Bollette inserite"
            value={`${bills.length}`}
            sub="Nel database"
          />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-medium mb-6">Consumi nel tempo</h2>
          <ConsumptionChart bills={bills} />
        </div>

      </div>
    </div>
  )
}