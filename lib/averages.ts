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
  telefono: {
    // Niente media ARERA: il telefono/internet non è un servizio regolamentato,
    // quindi non lo confrontiamo con una media nazionale — resta comunque
    // tracciato in KPI e grafici.
    monthly_eur: null,
    monthly_kwh: null,
    label: 'Telefono / Internet',
  },
}

export type UtilityType = keyof typeof NATIONAL_AVERAGES