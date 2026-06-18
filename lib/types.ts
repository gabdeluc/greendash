import type { UtilityType } from './averages'

// Riga "grezza" come arriva da Supabase, prima delle conversioni numeriche.
// I numerici possono arrivare come stringa o numero a seconda del driver,
// quindi li tipizziamo entrambi e li normalizziamo con Number(...) a valle.
export type BillRow = {
  id: string
  type: UtilityType
  month: number | string
  year: number | string
  amount_eur: number | string
  kwh: number | string | null
  months_covered: number | string | null
}