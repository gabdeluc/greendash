'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { UtilityType } from '@/lib/averages'

type Props = {
  budgets: Record<UtilityType, number>
}

const UTILITY: { type: UtilityType; label: string; icon: string; color: string; placeholder: string }[] = [
  { type: 'luce',     label: 'Luce',     icon: 'bolt',                  color: '#f59e0b', placeholder: 'es. 80' },
  { type: 'gas',      label: 'Gas',      icon: 'local_fire_department', color: '#f97316', placeholder: 'es. 100' },
  { type: 'acqua',    label: 'Acqua',    icon: 'water_drop',            color: '#3b82f6', placeholder: 'es. 30' },
  { type: 'telefono', label: 'Telefono', icon: 'call',                  color: '#a78bfa', placeholder: 'es. 35' },
]

const TYPES: UtilityType[] = ['luce', 'gas', 'acqua', 'telefono']

export default function BudgetSettings({ budgets }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<Record<UtilityType, string>>({
    luce:     budgets.luce     > 0 ? String(budgets.luce)     : '',
    gas:      budgets.gas      > 0 ? String(budgets.gas)      : '',
    acqua:    budgets.acqua    > 0 ? String(budgets.acqua)    : '',
    telefono: budgets.telefono > 0 ? String(budgets.telefono) : '',
  })

  async function handleSave() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Per ogni utenza: upsert se c'è un valore, delete se è vuoto/zero
    for (const t of TYPES) {
      const val = parseFloat(form[t])
      if (val > 0) {
        await supabase
          .from('budgets')
          .upsert({ user_id: user.id, type: t, monthly_eur: val }, { onConflict: 'user_id,type' })
      } else {
        await supabase
          .from('budgets')
          .delete()
          .eq('user_id', user.id)
          .eq('type', t)
      }
    }

    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-6 space-y-5">

      <p className="text-[#bbcabf] text-sm leading-relaxed">
        Imposta un tetto di spesa mensile per ogni utenza. La dashboard mostrerà
        automaticamente quanto hai consumato rispetto al budget. Lascia vuoto per
        non impostare un limite.
      </p>

      <div className="space-y-4">
        {UTILITY.map(u => (
          <div key={u.type}>
            <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#bbcabf] mb-2">
              <span className="material-symbols-outlined text-[16px]"
                style={{ color: u.color, fontVariationSettings: "'FILL' 1" }}>
                {u.icon}
              </span>
              <span style={{ color: u.color }}>{u.label}</span>
              <span className="text-[#bbcabf]/50 normal-case font-normal tracking-normal">— budget mensile</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbcabf] text-sm">€</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form[u.type]}
                onChange={e => setForm(prev => ({ ...prev, [u.type]: e.target.value }))}
                placeholder={u.placeholder}
                className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg pl-8 pr-16 py-2.5 text-[#dde2f3] text-sm placeholder:text-[#bbcabf]/30 focus:outline-none focus:border-[#4edea3] transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbcabf]/50 text-xs">/mese</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#3c4a42] pt-5 flex items-center justify-end gap-3">
        {success && (
          <span className="text-[#4edea3] text-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Budget salvato
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={loading || success}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          {loading ? 'Salvataggio...' : 'Salva Budget'}
        </button>
      </div>
    </div>
  )
}