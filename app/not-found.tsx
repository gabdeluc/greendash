import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e131f] flex items-center justify-center p-8">
      <div className="text-center max-w-sm">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-[#1a202c] border border-[#3c4a42] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#bbcabf] text-4xl">
              search_off
            </span>
          </div>
        </div>

        <p className="text-[#4edea3] text-6xl font-bold mb-3 tracking-tight">404</p>
        <h1 className="text-[#dde2f3] text-xl font-semibold mb-3">Pagina non trovata</h1>
        <p className="text-[#bbcabf] text-sm leading-relaxed mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Torna alla Dashboard
        </Link>
      </div>
    </div>
  )
}