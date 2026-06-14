type Props = {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
}

export default function KpiCard({ label, value, sub, trend }: Props) {
  const trendColor =
    trend === 'up' ? 'text-red-400' :
    trend === 'down' ? 'text-green-400' : 'text-gray-500'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">{label}</p>
      <p className="text-white text-2xl font-medium mb-1">{value}</p>
      {sub && <p className={`text-xs ${trendColor}`}>{sub}</p>}
    </div>
  )
}