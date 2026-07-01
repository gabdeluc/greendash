import type { UtilityType } from './averages'

export type BillRow = {
  id: string
  type: UtilityType
  month: number | string
  year: number | string
  amount_eur: number | string
  kwh: number | string | null
  months_covered: number | string | null
}

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

// Versione "leggera" di ContractRow, usata quando la query seleziona
// solo i campi necessari per il widget dei rinnovi in dashboard
export type ContractRenewalRow = {
  id: string
  type: UtilityType
  provider_name: string
  renewal_date: string
}

export type BudgetRow = {
  id?: string
  type: UtilityType
  monthly_eur: number | string
}