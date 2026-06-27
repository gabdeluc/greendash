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

export type BudgetRow = {
  id: string
  type: UtilityType
  monthly_eur: number | string
}