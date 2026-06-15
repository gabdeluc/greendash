export const NATIONAL_AVERAGES = {
  luce: {
    monthly_eur: 70,
    monthly_kwh: 220,
    label: 'Media nazionale luce',
  },
  gas: {
    monthly_eur: 95,
    monthly_kwh: 150,
    label: 'Media nazionale gas',
  },
  acqua: {
    monthly_eur: 25,
    monthly_kwh: null,
    label: 'Media nazionale acqua',
  },
}

export type UtilityType = keyof typeof NATIONAL_AVERAGES