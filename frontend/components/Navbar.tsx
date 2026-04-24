export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 flex justify-between items-center h-16 px-6 w-full fixed top-0 z-40">
      
      <span className="text-xl font-black tracking-tighter text-slate-900">
        BidFlow
      </span>

      <div className="flex-1 max-w-md mx-8">
        <input
          className="w-full pl-4 pr-4 py-2 bg-slate-100 border border-gray-200 rounded text-sm outline-none focus:border-blue-900"
          placeholder="Buscar..."
          type="text"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold">
            AG
          </div>
          <span className="text-sm font-semibold text-slate-800">Ana García</span>
        </div>
      </div>

    </nav>
  )
}