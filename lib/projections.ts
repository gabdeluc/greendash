type DataPoint = { x: number; y: number }

function linearRegression(points: DataPoint[]) {
  const n = points.length
  if (n < 2) return null

  const sumX = points.reduce((s, p) => s + p.x, 0)
  const sumY = points.reduce((s, p) => s + p.y, 0)
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return { slope, intercept }
}

export type Bill = {
  month: number
  year: number
  type: string
  amount_eur: number
  months_covered?: number
}

export type ProjectionPoint = {
  label: string
  value: number
  isProjection: boolean
}

const MONTHS = ['Gen','Feb','Mar','Apr','Mag','Giu',
                 'Lug','Ago','Set','Ott','Nov','Dic']

export function getProjections(bills: Bill[], type: string): ProjectionPoint[] {
  const filtered = bills
    .filter((b) => b.type === type)
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)

  if (filtered.length < 2) return []

  const points: DataPoint[] = filtered.map((b, i) => ({ x: i, y: b.amount_eur }))
  const reg = linearRegression(points)
  if (!reg) return []

  const history: ProjectionPoint[] = filtered.map((b) => ({
    label: `${MONTHS[b.month - 1]} ${b.year}`,
    value: Math.round(b.amount_eur * 100) / 100,
    isProjection: false,
  }))

  const last = filtered[filtered.length - 1]
  const cadence = last.months_covered ?? 1
  const projections: ProjectionPoint[] = []

  for (let i = 1; i <= 3; i++) {
    const futureX = points.length - 1 + i
    const projected = reg.slope * futureX + reg.intercept
    const monthsAhead = cadence * i
    const futureMonth = ((last.month - 1 + monthsAhead) % 12) + 1
    const futureYear = last.year + Math.floor((last.month - 1 + monthsAhead) / 12)

    projections.push({
      label: `${MONTHS[futureMonth - 1]} ${futureYear}`,
      value: Math.max(0, Math.round(projected * 100) / 100),
      isProjection: true,
    })
  }

  return [...history, ...projections]
}