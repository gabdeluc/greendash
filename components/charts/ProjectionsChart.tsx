'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import type { ProjectionPoint } from '@/lib/projections'

type Props = {
  data: ProjectionPoint[]
  color: string
  label: string
}

export default function ProjectionChart({ data, color, label }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-gray-600 text-sm text-center py-8">
        Inserisci almeno 2 bollette di questo tipo per vedere le proiezioni
      </p>
    )
  }

  const firstProjection = data.find((d) => d.isProjection)?.label

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} unit="€" />
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid #374151',
            borderRadius: 8,
          }}
          labelStyle={{ color: '#f9fafb', fontSize: 12 }}
          formatter={(value) => {
            const num = typeof value === 'number' ? value : Number(value)
            return [`€${num.toFixed(2)}`, label]
          }}
        />
        {firstProjection && (
          <ReferenceLine
            x={firstProjection}
            stroke="#374151"
            strokeDasharray="4 4"
            label={{ value: 'Proiezione →', fill: '#6b7280', fontSize: 11 }}
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={(props) => {
            const { cx, cy, payload } = props
            return (
              <circle
                key={`dot-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={4}
                fill={payload.isProjection ? 'transparent' : color}
                stroke={color}
                strokeWidth={2}
                strokeDasharray={payload.isProjection ? '3 2' : '0'}
              />
            )
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}