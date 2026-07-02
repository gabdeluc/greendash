'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'
import { useToast, Toast } from '@/components/ui/Toast'
import { CONSUMPTION_UNIT, type UtilityType } from '@/lib/averages'

const MONTHS = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
  'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']

const UTILITY = [
  { type: 'luce',     label: 'Luce',     icon: 'bolt',                  color: '#f59e0b' },
  { type: 'gas',      label: 'Gas',      icon: 'local_fire_department', color: '#f97316' },
  { type: 'acqua',    label: 'Acqua',    icon: 'water_drop',            color: '#3b82f6' },
  { type: 'telefono', label: 'Telefono', icon: 'call',                  color: '#a78bfa' },
]

const DEFAULT_MONTHS_COVERED: Record<string, number> = {
  luce: 2, gas: 2, acqua: 3, telefono: 1,
}

const FREQUENCY_OPTIONS = [
  { value: 1, label: 'Mensile' },
  { value: 2, label: 'Bimestrale' },
  { value: 3, label: 'Trimestrale' },
  { value: 4, label: 'Quadrimestrale' },
]

export default function InserisciPage() {
  const supabase = createClient()
  const router   = useRouter()
  const { toast, show } = useToast()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    type: 'luce', month: new Date().getMonth() + 1,
    year: new Date().getFullYear(), amount_eur: '', kwh: '',
    months_covered: 2,
  })

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function selectType(type: string) {
    setForm(prev => ({ ...prev, type, months_covered: DEFAULT_MONTHS_COVERED[type] ?? 1 }))
  }

  async function handleSubmit() {
    if (!form.amount_eur) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { error } = await supabase.from('bills').insert({
      user_id: user.id,
      type: form.type,
      month: Number(form.month),
      year: Number(form.year),
      amount_eur: Number(form.amount_eur),
      kwh: form.kwh ? Number(form.kwh) : null,
      months_covered: Number(form.months_covered),
    })
    setLoading(false)
    if (!error) {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); router.push('/dashboard') }, 1500)
    } else {
      // FIX: prima un errore Supabase falliva in silenzio, l'utente non
      // capiva perché la bolletta non veniva salvata
      show('error', 'Errore durante il salvataggio: ' + error.message)
    }
  }

  const consumptionUnit = CONSUMPTION_UNIT[form.type as UtilityType]

  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3]">
      <Sidebar email={email} />

      <div className="ml-[240px] min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#3c4a42] sticky top-0 bg-[#0e131f] z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              energy_savings_leaf
            </span>
            <span className="text-[#4edea3] font-semibold text-lg tracking-tight">GreenDash</span>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-[680px]">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Inserisci Bolletta</h1>
          <p className="text-[#bbcabf] text-sm mb-8">
            Registra i dati dell&apos;ultima utenza per mantenere aggiornate le statistiche.
          </p>

          <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-6 space-y-6">

            <div>
              <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-3">
                Tipo Utenza
              </label>
              <div className="grid grid-cols-4 gap-3">
                {UTILITY.map(u => (
                  <button
                    key={u.type}
                    onClick={() => selectType(u.type)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all
                      ${form.type === u.type
                        ? 'border-current bg-[#242a36]'
                        : 'border-[#3c4a42] hover:border-[#86948a] hover:bg-[#242a36]'}`}
                    style={{ color: form.type === u.type ? u.color : '#bbcabf' }}
                  >
                    <span className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      {u.icon}
                    </span>
                    <span className="text-sm font-medium">{u.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-2">
                Periodo di Fatturazione
              </label>
              <select
                value={form.months_covered}
                onChange={e => set('months_covered', Number(e.target.value))}
                className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg px-3 py-2.5 text-[#dde2f3] text-sm focus:outline-none focus:border-[#4edea3] transition-colors appearance-none"
              >
                {FREQUENCY_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-2">Mese</label>
                  <select
                    value={form.month}
                    onChange={e => set('month', e.target.value)}
                    className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg px-3 py-2.5 text-[#dde2f3] text-sm focus:outline-none focus:border-[#4edea3] transition-colors appearance-none"
                  >
                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-2">Anno</label>
                  <select
                    value={form.year}
                    onChange={e => set('year', e.target.value)}
                    className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg px-3 py-2.5 text-[#dde2f3] text-sm focus:outline-none focus:border-[#4edea3] transition-colors appearance-none"
                  >
                    {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              {form.months_covered > 1 && (
                <p className="text-[#bbcabf] text-[11px] mt-2">
                  Indica il mese di chiusura del periodo (es. bolletta Mag–Giu → seleziona Giugno).
                </p>
              )}
            </div>

            <div>
              <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-2">Importo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbcabf] text-sm">€</span>
                <input
                  type="number"
                  value={form.amount_eur}
                  onChange={e => set('amount_eur', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg pl-8 pr-4 py-2.5 text-[#dde2f3] text-sm focus:outline-none focus:border-[#4edea3] transition-colors"
                />
              </div>
            </div>

            {consumptionUnit && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider">
                    Consumo (Opzionale)
                  </label>
                  {/* FIX: prima era hardcodato "kWh" anche per gas/acqua */}
                  <span className="text-[#bbcabf] text-[11px]">{consumptionUnit}</span>
                </div>
                <input
                  type="number"
                  value={form.kwh}
                  onChange={e => set('kwh', e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg px-4 py-2.5 text-[#dde2f3] text-sm focus:outline-none focus:border-[#4edea3] transition-colors"
                />
              </div>
            )}

            <div className="border-t border-[#3c4a42] pt-6 flex items-center gap-3 justify-end">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-lg border border-[#3c4a42] text-[#bbcabf] hover:text-[#dde2f3] hover:border-[#86948a] text-sm font-medium transition-all"
              >
                Annulla
              </Link>
              <button
                onClick={handleSubmit}
                disabled={loading || success}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                {success ? 'Salvata!' : loading ? 'Salvataggio...' : 'Salva Bolletta'}
              </button>
            </div>
          </div>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  )
}