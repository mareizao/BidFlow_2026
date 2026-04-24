import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

const licitaciones = [
  { id: "BID-2023-089", nombre: "Modernización Infraestructura IT", estado: "Abierta", sme: "Carlos Mendoza", progreso: 45, fecha: "24 Oct 2023" },
  { id: "BID-2023-088", nombre: "Provisión Servicios Cloud Q4", estado: "En Revisión", sme: "Ana Silveira", progreso: 90, fecha: "22 Oct 2023" },
  { id: "BID-2023-087", nombre: "Consultoría Seguridad Ciberfísica", estado: "Cerrada", sme: "Roberto Gómez", progreso: 100, fecha: "15 Oct 2023" },
  { id: "BID-2023-086", nombre: "Suministro Equipos Red", estado: "Abierta", sme: "Laura Torres", progreso: 15, fecha: "25 Oct 2023" },
]

const badgeEstado = (estado: string) => {
  if (estado === "Abierta") return "bg-green-100 text-green-800"
  if (estado === "En Revisión") return "bg-yellow-100 text-yellow-800"
  return "bg-gray-100 text-gray-600"
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="ml-56 pt-16 p-8">

        {/* Título */}
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Tablero de Licitaciones
        </h1>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", valor: 142, color: "text-slate-900" },
            { label: "Abiertas", valor: 38, color: "text-green-700" },
            { label: "En Revisión", valor: 12, color: "text-yellow-700" },
            { label: "Cerradas", valor: 92, color: "text-slate-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
                {stat.label}
              </p>
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.valor}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#1e3a5f]">Licitaciones Recientes</h2>
            <button className="bg-[#1e3a5f] text-white text-sm px-4 py-2 rounded font-semibold hover:bg-[#022448]">
              Nueva Licitación
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                {["ID", "Nombre", "Estado", "SME Asignado", "Progreso", "Última Actualización"].map((col) => (
                  <th key={col} className="py-3 px-6 text-xs font-semibold tracking-widest text-[#1e3a5f] uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {licitaciones.map((lic, i) => (
                <tr key={lic.id} className={`border-b border-gray-200 hover:bg-blue-50 ${i % 2 !== 0 ? "bg-slate-50" : ""}`}>
                  <td className="py-4 px-6 font-mono text-xs text-gray-500">{lic.id}</td>
                  <td className="py-4 px-6 font-medium text-slate-800">{lic.nombre}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${badgeEstado(lic.estado)}`}>
                      {lic.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{lic.sme}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-[#1e3a5f] h-2 rounded-full" style={{ width: `${lic.progreso}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{lic.progreso}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{lic.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}