'use client'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

type Slice = { name: string; value: number; color: string }

type Props = {
  data: Slice[]
  year?: number
}

export default function SpendingPieChart({ data, year }: Props) {
  const filtered = data.filter(d => d.value > 0)
  const total = filtered.reduce((s, d) => s + d.value, 0)

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#bbcabf] text-sm">
        Nessun dato disponibile
      </div>
    )
  }

  return (
    <div>
      <p className="text-[#bbcabf] text-xs mb-2">
        {year ? `Anno ${year}` : 'Totale'} ·{' '}
        <span className="text-[#dde2f3] font-semibold">€ {total.toFixed(2)}</span>
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={filtered}
            cx="50%"
            cy="50%"
            innerRadius={62}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {filtered.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid #374151',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#f9fafb', fontSize: 12 }}
            formatter={(value) => {
              const num = typeof value === 'number' ? value : Number(value)
              const pct = total > 0 ? ((num / total) * 100).toFixed(1) : '0'
              return [`€ ${num.toFixed(2)}  (${pct}%)`, '']
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) => (
              <span style={{ color: '#bbcabf' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}