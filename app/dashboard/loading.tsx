export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3]">
      {/* Sidebar placeholder */}
      <div className="fixed left-0 top-0 h-screen w-[240px] bg-[#161c28] border-r border-[#3c4a42]" />

      <div className="ml-[240px] min-h-screen flex flex-col">
        {/* Header placeholder */}
        <div className="h-[57px] border-b border-[#3c4a42] bg-[#0e131f]" />

        <main className="flex-1 p-8 max-w-[1280px] w-full">
          {/* Title */}
          <div className="h-7 w-28 bg-[#1a202c] rounded-lg mb-2 animate-pulse" />
          <div className="h-4 w-64 bg-[#1a202c] rounded mb-8 animate-pulse" />

          {/* Annual summary bar */}
          <div className="h-[72px] bg-[#1a202c] border border-[#3c4a42] rounded-xl mb-6 animate-pulse" />

          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1a202c] border border-[#3c4a42] rounded-xl p-5 h-44 animate-pulse"
              />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-[#1a202c] border border-[#3c4a42] rounded-xl h-80 animate-pulse" />
            <div className="bg-[#1a202c] border border-[#3c4a42] rounded-xl h-80 animate-pulse" />
          </div>
        </main>
      </div>
    </div>
  )
}