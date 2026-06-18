import { createServerSupabaseClient } from '@/lib/supabase-servers'
import { NextResponse } from 'next/server'

function randomAmount(min: number, max: number) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100
}

function monthsAgo(baseMonth: number, baseYear: number, n: number) {
  const index = baseYear * 12 + (baseMonth - 1) - n
  return { month: (index % 12) + 1, year: Math.floor(index / 12) }
}

export async function POST() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const now = new Date()
  const baseMonth = now.getMonth() + 1
  const baseYear = now.getFullYear()

  const rows: Record<string, unknown>[] = []

  // Luce — bimestrale, ultimi 12 mesi (6 bollette)
  for (let i = 0; i < 6; i++) {
    const { month, year } = monthsAgo(baseMonth, baseYear, i * 2)
    rows.push({
      user_id: user.id, type: 'luce', month, year,
      months_covered: 2,
      amount_eur: randomAmount(130, 190),
      kwh: randomAmount(280, 420),
    })
  }

  // Gas — bimestrale
  for (let i = 0; i < 6; i++) {
    const { month, year } = monthsAgo(baseMonth, baseYear, i * 2)
    rows.push({
      user_id: user.id, type: 'gas', month, year,
      months_covered: 2,
      amount_eur: randomAmount(160, 240),
      kwh: null,
    })
  }

  // Acqua — trimestrale (varia molto per comune, è solo un default)
  for (let i = 0; i < 4; i++) {
    const { month, year } = monthsAgo(baseMonth, baseYear, i * 3)
    rows.push({
      user_id: user.id, type: 'acqua', month, year,
      months_covered: 3,
      amount_eur: randomAmount(65, 95),
      kwh: null,
    })
  }

  // Telefono — mensile
  for (let i = 0; i < 12; i++) {
    const { month, year } = monthsAgo(baseMonth, baseYear, i)
    rows.push({
      user_id: user.id, type: 'telefono', month, year,
      months_covered: 1,
      amount_eur: randomAmount(29, 45),
      kwh: null,
    })
  }

  const { error } = await supabase.from('bills').insert(rows)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inserted: rows.length })
}