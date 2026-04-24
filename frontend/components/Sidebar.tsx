import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="bg-white border-r border-gray-200 flex flex-col py-6 w-56 fixed left-0 top-16 h-full">
      
      <div className="px-5 pb-5 mb-2 border-b border-gray-100">
        <p className="text-sm text-gray-500">Gestión de Licitaciones</p>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        <Link href="/"
          className="text-slate-600 px-4 py-3 flex items-center gap-3 hover:bg-slate-50 rounded text-sm">
          📊 Dashboard
        </Link>
        <Link href="/"
          className="text-slate-600 px-4 py-3 flex items-center gap-3 hover:bg-slate-50 rounded text-sm">
          ⚖️ Licitaciones
        </Link>
        <Link href="/pliegos"
          className="text-[#1e3a5f] bg-blue-50 border-l-4 border-[#1e3a5f] px-4 py-3 flex items-center gap-3 rounded-r text-sm font-medium">
          📄 Documentos
        </Link>
        <Link href="/"
          className="text-slate-600 px-4 py-3 flex items-center gap-3 hover:bg-slate-50 rounded text-sm">
          ⚙️ Configuración
        </Link>
      </nav>

    </aside>
  )
}