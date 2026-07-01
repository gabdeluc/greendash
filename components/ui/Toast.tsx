'use client'
import { useState, useCallback, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info'
export type ToastState = { type: ToastType; message: string; id: number } | null

const CONFIG: Record<ToastType, { icon: string; color: string; hex: string }> = {
  success: { icon: 'check_circle', color: 'text-[#4edea3]', hex: '#4edea3' },
  error:   { icon: 'error',        color: 'text-red-400',   hex: '#f87171' },
  info:    { icon: 'info',         color: 'text-blue-400',  hex: '#60a5fa' },
}

// Hook da usare nei componenti client
export function useToast() {
  const [toast, setToast] = useState<ToastState>(null)

  const show = useCallback((type: ToastType, message: string) => {
    setToast({ type, message, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  return { toast, show }
}

// Componente da aggiungere in fondo al JSX di ogni pagina/componente
export function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null
  const c = CONFIG[toast.type]

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl shadow-black/50"
      style={{ background: `${c.hex}12`, borderColor: `${c.hex}35` }}
    >
      <span
        className={`material-symbols-outlined text-[18px] flex-shrink-0 ${c.color}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {c.icon}
      </span>
      <span className={`text-sm font-medium ${c.color}`}>{toast.message}</span>
    </div>
  )
}