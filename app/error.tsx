'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0e131f] flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-[#1a202c] border border-[#3c4a42] flex items-center justify-center">
            <span className="material-symbols-outlined text-red-400 text-4xl">
              error
            </span>
          </div>
        </div>

        <h1 className="text-[#dde2f3] text-xl font-semibold mb-3">Qualcosa è andato storto</h1>
        <p className="text-[#bbcabf] text-sm leading-relaxed mb-8">
          Si è verificato un errore imprevisto. Riprova, oppure torna alla dashboard.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm px-5 py-3 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Riprova
          </button>
          
            <a
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[#3c4a42] text-[#bbcabf] hover:text-[#dde2f3] hover:border-[#86948a] text-sm font-medium px-5 py-3 rounded-lg transition-all"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}