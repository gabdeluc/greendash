'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useToast, Toast } from '@/components/ui/Toast'
import { UTILITY_LIST } from '@/lib/utility-config'

type FormState = {
  id?: string
  type: string
  provider_name: string
  tariff_name: string
  activation_date: string
  renewal_date: string
  monthly_eur: string
  notes: string
}

type Props = {
  initial?: FormState
  defaultType?: string
}

export default function ContrattoForm({ initial, defaultType = 'luce' }: Props) {
  const supabase = createClient()
  const router   = useRouter()
  const { toast, show } = useToast()
  const [loading, setLoading]             = useState(false)
  const [success, setSuccess]             = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [form, setForm] = useState<FormState>({
    type:            initial?.type            ?? defaultType,
    provider_name:   initial?.provider_name   ?? '',
    tariff_name:     initial?.tariff_name     ?? '',
    activation_date: initial?.activation_date ?? '',
    renewal_date:    initial?.renewal_date    ?? '',
    monthly_eur:     initial?.monthly_eur     ?? '',
    notes:           initial?.notes           ?? '',
  })

  const isEdit = !!initial?.id

  function set(field: keyof Omit<FormState, 'id'>, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.provider_name.trim()) return
    setLoading(true)

    const payload = {
      type:            form.type,
      provider_name:   form.provider_name.trim(),
      tariff_name:     form.tariff_name.trim()  || null,
      activation_date: form.activation_date     || null,
      renewal_date:    form.renewal_date        || null,
      monthly_eur:     form.monthly_eur ? Number(form.monthly_eur) : null,
      notes:           form.notes.trim()        || null,
    }

    let error: { message: string } | null = null

    if (isEdit) {
      ;({ error } = await supabase.from('contracts').update(payload).eq('id', initial!.id!))
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      ;({ error } = await supabase.from('contracts').insert({ ...payload, user_id: user.id }))
    }

    setLoading(false)
    if (!error) {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); router.push('/contratti') }, 1200)
    } else {
      show('error', 'Errore: ' + error.message)
    }
  }

  async function handleDelete() {
    if (!initial?.id) return
    setLoading(true)
    const { error } = await supabase.from('contracts').delete().eq('id', initial.id)
    setLoading(false)
    if (!error) {
      router.push('/contratti')
    } else {
      show('error', 'Errore: ' + error.message)
    }
  }

  return (
    <>
      <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-6 space-y-6">

        <div>
          <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-3">
            Tipo Utenza
          </label>
          <div className="grid grid-cols-4 gap-3">
            {UTILITY_LIST.map(u => (
              <button
                key={u.type}
                onClick={() => set('type', u.type)}
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
            Fornitore <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.provider_name}
            onChange={e => set('provider_name', e.target.value)}
            placeholder="es. Enel, ENI Gas e Luce, Fastweb…"
            className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg px-4 py-2.5 text-[#dde2f3] text-sm placeholder:text-[#bbcabf]/40 focus:outline-none focus:border-[#4edea3] transition-colors"
          />
        </div>

        <div>
          <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-2">
            Nome Tariffa <span className="text-[#bbcabf]/50">(opzionale)</span>
          </label>
          <input
            type="text"
            value={form.tariff_name}
            onChange={e => set('tariff_name', e.target.value)}
            placeholder="es. Tutela Simile, Placet, Mercato Libero…"
            className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg px-4 py-2.5 text-[#dde2f3] text-sm placeholder:text-[#bbcabf]/40 focus:outline-none focus:border-[#4edea3] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-2">
              Data Attivazione
            </label>
            <input
              type="date"
              value={form.activation_date}
              onChange={e => set('activation_date', e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg px-4 py-2.5 text-[#dde2f3] text-sm focus:outline-none focus:border-[#4edea3] transition-colors"
            />
          </div>
          <div>
            <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-2">
              Data Rinnovo
            </label>
            <input
              type="date"
              value={form.renewal_date}
              onChange={e => set('renewal_date', e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg px-4 py-2.5 text-[#dde2f3] text-sm focus:outline-none focus:border-[#4edea3] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-2">
            Costo Mensile Stimato <span className="text-[#bbcabf]/50">(opzionale)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbcabf] text-sm">€</span>
            <input
              type="number"
              value={form.monthly_eur}
              onChange={e => set('monthly_eur', e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg pl-8 pr-4 py-2.5 text-[#dde2f3] text-sm focus:outline-none focus:border-[#4edea3] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider block mb-2">
            Note <span className="text-[#bbcabf]/50">(opzionale)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Condizioni particolari, numero cliente, codice POD/PDR…"
            rows={3}
            className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg px-4 py-2.5 text-[#dde2f3] text-sm placeholder:text-[#bbcabf]/40 focus:outline-none focus:border-[#4edea3] transition-colors resize-none"
          />
        </div>

        <div className="border-t border-[#3c4a42] pt-6 flex items-center justify-between gap-3">
          {isEdit ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-[#bbcabf] text-sm">Eliminare questo contratto?</span>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : 'Sì, elimina'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#bbcabf] hover:text-[#dde2f3] transition-colors"
                >
                  Annulla
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10 text-sm font-medium transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Elimina
              </button>
            )
          ) : <div />}

          <div className="flex items-center gap-3">
            <Link
              href="/contratti"
              className="px-5 py-2.5 rounded-lg border border-[#3c4a42] text-[#bbcabf] hover:text-[#dde2f3] hover:border-[#86948a] text-sm font-medium transition-all"
            >
              Annulla
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading || success || !form.provider_name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {success ? 'Salvato!' : loading ? 'Salvataggio...' : isEdit ? 'Salva Modifiche' : 'Salva Contratto'}
            </button>
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </>
  )
}