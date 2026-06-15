import { NATIONAL_AVERAGES, type UtilityType } from './averages'

type Bill = {
  type: string
  amount_eur: number
  kwh: number | null
}

type Suggestion = {
  type: 'warning' | 'success' | 'info'
  title: string
  body: string
}

export function getSuggestions(bills: Bill[]): Suggestion[] {
  const suggestions: Suggestion[] = []

  const types: UtilityType[] = ['luce', 'gas', 'acqua']

  for (const utilType of types) {
    const typeBills = bills.filter((b) => b.type === utilType)
    if (typeBills.length === 0) continue

    const avg = typeBills.reduce((s, b) => s + b.amount_eur, 0) / typeBills.length
    const national = NATIONAL_AVERAGES[utilType].monthly_eur
    const diff = ((avg - national) / national) * 100

    if (diff > 20) {
      suggestions.push({
        type: 'warning',
        title: `Spesa ${utilType} alta`,
        body: `La tua spesa media per ${utilType} (€${avg.toFixed(0)}/mese) è il ${diff.toFixed(0)}% sopra la media nazionale (€${national}/mese). Valuta di confrontare le tariffe dei fornitori rinnovabili.`,
      })
    } else if (diff < -10) {
      suggestions.push({
        type: 'success',
        title: `Ottimo consumo ${utilType}`,
        body: `La tua spesa per ${utilType} è il ${Math.abs(diff).toFixed(0)}% sotto la media nazionale. Continua così!`,
      })
    }

    // Suggerimento costo per kWh
    if (utilType === 'luce') {
      const withKwh = typeBills.filter((b) => b.kwh && b.kwh > 0)
      if (withKwh.length > 0) {
        const costPerKwh =
          withKwh.reduce((s, b) => s + b.amount_eur / (b.kwh ?? 1), 0) / withKwh.length
        if (costPerKwh > 0.35) {
          suggestions.push({
            type: 'info',
            title: 'Costo per kWh elevato',
            body: `Il tuo costo medio è €${costPerKwh.toFixed(3)}/kWh. La media di mercato è circa €0,25/kWh. Potrebbe valere la pena rinegoziare il contratto.`,
          })
        }
      }
    }
  }

  if (suggestions.length === 0) {
    suggestions.push({
      type: 'info',
      title: 'Tutto nella norma',
      body: 'I tuoi consumi sono in linea con la media nazionale. Inserisci più bollette per un\'analisi più precisa.',
    })
  }

  return suggestions
}