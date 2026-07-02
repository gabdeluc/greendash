import type { UtilityType } from './averages'

export type UtilityConfig = {
  type: UtilityType
  label: string
  icon: string
  color: string
}

// Fonte unica di verità per label/icona/colore di ogni utenza.
// Prima ogni pagina/componente ridefiniva questi dati da zero, con rischio
// di incoerenze (es. la dashboard mostrava "Electricity"/"Water" in inglese
// mentre tutto il resto dell'app è in italiano). Ora chi ha bisogno di questi
// dati importa da qui: se domani aggiungi una 5ª utenza, la modifichi in
// UN solo punto invece che in 6 file diversi.
export const UTILITY_LIST: UtilityConfig[] = [
  { type: 'luce',     label: 'Luce',     icon: 'bolt',                  color: '#f59e0b' },
  { type: 'gas',      label: 'Gas',      icon: 'local_fire_department', color: '#f97316' },
  { type: 'acqua',    label: 'Acqua',    icon: 'water_drop',            color: '#3b82f6' },
  { type: 'telefono', label: 'Telefono', icon: 'call',                  color: '#a78bfa' },
]

// Versione "a dizionario" per accesso diretto tipo UTILITY_CONFIG['luce']
export const UTILITY_CONFIG: Record<UtilityType, UtilityConfig> = {
  luce:     UTILITY_LIST[0],
  gas:      UTILITY_LIST[1],
  acqua:    UTILITY_LIST[2],
  telefono: UTILITY_LIST[3],
}

// Lista dei tipi, utile per iterare (map, filter...) senza riscrivere
// ['luce','gas','acqua','telefono'] in ogni file
export const UTILITY_TYPES: UtilityType[] = UTILITY_LIST.map(u => u.type)