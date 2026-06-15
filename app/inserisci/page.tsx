'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const MONTHS = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
  'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']

export default function InserisciPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    type: 'luce',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount_eur: '',
    kwh: '',
  })

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
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
    })

    setLoading(false)
    if (!error) {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); router.push('/dashboard') }, 1500)
    }
  }

  const typeColors: Record<string, string> = {
    luce:  'border-yellow-500 text-yellow-400',
    gas:   'border-orange-500 text-orange-400',
    acqua: 'border-blue-500 text-blue-400',
  }

  return (
    // Sostituisci il div esterno con:
<div className="min-h-screen bg-gray-950 px-4 py-8 md:p-8">
  <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <a href="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm">← Dashboard</a>
        </div>

        <h1 className="text-white font-medium text-xl mb-6">Inserisci bolletta</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
          {/* Tipo */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Tipo</label>
            <div className="flex gap-2">
              {['luce','gas','acqua'].map(t => (
                <button
                  key={t}
                  onClick={() => set('type', t)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition-all
                    ${form.type === t
                      ? typeColors[t] + ' bg-gray-800'
                      : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}
                >
                  {t === 'luce' ? '⚡' : t === 'gas' ? '🔥' : '💧'} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Mese e Anno */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Mese</label>
              <select
                value={form.month}
                onChange={e => set('month', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Anno</label>
              <select
                value={form.year}
                onChange={e => set('year', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              >
                {[2023,2024,2025,2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Importo */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Importo (€)</label>
            <input
              type="number"
              value={form.amount_eur}
              onChange={e => set('amount_eur', e.target.value)}
              placeholder="es. 87.50"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            />
          </div>

          {/* kWh (opzionale) */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
              kWh consumati <span className="text-gray-600">(opzionale)</span>
            </label>
            <input
              type="number"
              value={form.kwh}
              onChange={e => set('kwh', e.target.value)}
              placeholder="es. 210"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="w-full bg-green-500 hover:bg-green-400 text-gray-950 font-medium rounded-lg py-2.5 text-sm transition-colors disabled:opacity-50"
          >
            {success ? '✓ Salvata!' : loading ? 'Salvataggio...' : 'Salva bolletta'}
          </button>
        </div>
      </div>
    </div>
  )
}