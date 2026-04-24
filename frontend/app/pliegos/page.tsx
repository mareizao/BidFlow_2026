import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

export default function CargarPliego() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="ml-56 pt-16 p-8">
        <div className="max-w-3xl mx-auto">

          <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Cargar Pliego Técnico</h1>
            <p className="text-base text-gray-500">
              Ingrese los detalles de la licitación y adjunte los documentos requeridos.
            </p>
          </header>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <div className="space-y-6">

                {/* Campos del formulario */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1">
                      Nombre de la Licitación
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded text-sm outline-none focus:border-[#1e3a5f]"
                      placeholder="Ej. Provisión de Equipos Informáticos"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1">
                      ID de la Licitación
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded text-sm outline-none focus:border-[#1e3a5f]"
                      placeholder="Ej. LIC-2023-001"
                      type="text"
                    />
                  </div>
                </div>

                {/* Dropdown SME */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    SME Responsable
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded text-sm outline-none focus:border-[#1e3a5f] bg-white">
                    <option value="">Seleccione un responsable</option>
                    <option value="1">Carlos Ruiz - IT</option>
                    <option value="2">Elena Vásquez - Legal</option>
                    <option value="3">Roberto Gómez - Operaciones</option>
                  </select>
                </div>

                {/* Zona drag & drop */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Zona de carga de documentos técnicos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl bg-slate-50 hover:bg-blue-50 cursor-pointer p-12 flex flex-col items-center text-center transition-colors">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">☁️</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      Arrastre y suelte sus archivos aquí
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">o haga clic para buscar en su computadora</p>
                    <p className="text-xs text-gray-400">Formatos aceptados: PDF, DOCX (Máx. 50MB)</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Botones */}
            <div className="p-6 bg-white flex justify-end gap-4">
              <button className="px-6 py-3 border border-gray-200 text-slate-800 text-sm font-semibold rounded hover:bg-slate-50">
                Cancelar
              </button>
              <button className="px-6 py-3 bg-[#1e3a5f] text-white text-sm font-semibold rounded hover:bg-[#022448] shadow-sm">
                Cargar Pliego
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}