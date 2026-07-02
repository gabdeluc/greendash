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

// Unità di misura del consumo per ciascuna utenza, usata in KPI e form.
// Nota: a database il campo si chiama genericamente "kwh" e viene riusato
// per Sm³ (gas) e m³ (acqua) — rinominarlo richiederebbe una migration,
// per un progetto di questa dimensione non ne vale la pena; l'etichetta
// mostrata all'utente è comunque sempre quella corretta grazie a questa mappa.
export const CONSUMPTION_UNIT: Record<UtilityType, string | null> = {
  luce: 'kWh',
  gas: 'Sm³',
  acqua: 'm³',
  telefono: null,
}