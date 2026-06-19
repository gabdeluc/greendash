import type { UtilityType } from './averages'

// Riga grezza della tabella bills come arriva da Supabase.
// I numerici possono arrivare come string o number, normalizziamo con Number() a valle.
export type BillRow = {
  id: string
  type: UtilityType
  month: number | string
  year: number | string
  amount_eur: number | string
  kwh: number | string | null
  months_covered: number | string | null
}

// Riga grezza della tabella contracts come arriva da Supabase.
export type ContractRow = {
  id: string
  type: UtilityType
  provider_name: string
  tariff_name: string | null
  activation_date: string | null
  renewal_date: string | null
  monthly_eur: number | string | null
  notes: string | null
}