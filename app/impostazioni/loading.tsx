export default function ImpostazioniLoading() {
  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3]">
      <div className="fixed left-0 top-0 h-screen w-[240px] bg-[#161c28] border-r border-[#3c4a42]" />
      <div className="ml-[240px] min-h-screen flex flex-col">
        <div className="h-[57px] border-b border-[#3c4a42] bg-[#0e131f]" />
        <main className="flex-1 p-8 max-w-[680px]">
          <div className="h-7 w-40 bg-[#1a202c] rounded-lg mb-2 animate-pulse" />
          <div className="h-4 w-56 bg-[#1a202c] rounded mb-8 animate-pulse" />
          <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl h-96 animate-pulse" />
        </main>
      </div>
    </div>
  )
}