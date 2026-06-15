'use client'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

type Props = {
  data: { value: number }[]
  color: string
}

export default function SparklineChart({ data, color }: Props) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}