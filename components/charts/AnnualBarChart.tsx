'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

export type YearData = {
  year: string
  luce: number
  gas: number
  acqua: number
  telefono: number
}

export default function AnnualBarChart({ data }: { data: YearData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#bbcabf] text-sm">
        Nessun dato disponibile
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} unit="€" />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
          labelStyle={{ color: '#f9fafb', fontSize: 12 }}
          formatter={(value) => {
            const num = typeof value === 'number' ? value : Number(value)
            return [`€${num.toFixed(2)}`]
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
        <Bar dataKey="luce"     fill="#f59e0b" name="Luce"     radius={[3, 3, 0, 0]} />
        <Bar dataKey="gas"      fill="#f97316" name="Gas"      radius={[3, 3, 0, 0]} />
        <Bar dataKey="acqua"    fill="#3b82f6" name="Acqua"    radius={[3, 3, 0, 0]} />
        <Bar dataKey="telefono" fill="#a78bfa" name="Telefono" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}