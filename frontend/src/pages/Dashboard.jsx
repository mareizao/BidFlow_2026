import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { getLicitaciones } from "../api/bidApi"

const badgeEstado = (estado) => {
  if (estado === "Abierta") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  if (estado === "En Revisión") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
}

export default function Dashboard() {
  const [licitaciones, setLicitaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getLicitaciones()
      .then(setLicitaciones)
      .finally(() => setCargando(false))
  }, [])

  const stats = [
    { label: "Total", valor: licitaciones.length, color: "text-slate-900 dark:text-white" },
    { label: "Abiertas", valor: licitaciones.filter((l) => l.estado === "Abierta").length, color: "text-green-700 dark:text-green-400" },
    { label: "En Revisión", valor: licitaciones.filter((l) => l.estado === "En Revisión").length, color: "text-yellow-700 dark:text-yellow-400" },
    { label: "Cerradas", valor: licitaciones.filter((l) => l.estado === "Cerrada").length, color: "text-gray-500 dark:text-gray-400" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
      <Navbar />
      <Sidebar />
      <main className="ml-56 pt-16 p-8">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tablero de Licitaciones
          </h1>
          <button
            onClick={() => navigate("/crear")}
            className="bg-primary text-white text-sm px-4 py-2 rounded font-semibold hover:bg-primary-dark transition-colors"
          >
            + Nueva Licitación
          </button>
        </div>

        {/* Tarjetas estadísticas */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 transition-colors">
              <p className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2">
                {s.label}
              </p>
              <p className={`text-4xl font-bold ${s.color}`}>{s.valor}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-primary dark:text-blue-400">
              Licitaciones Recientes
            </h2>
          </div>

          {cargando ? (
            <p className="text-center py-12 text-gray-400">Cargando...</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800">
                  {["ID", "Nombre", "Estado", "SME Asignado", "Progreso", "Última Actualización"].map((col) => (
                    <th key={col} className="py-3 px-6 text-xs font-semibold tracking-widest text-primary dark:text-blue-400 uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {licitaciones.map((lic, i) => (
                  <tr
                    key={lic.id}
                    onClick={() => navigate(`/licitacion/${lic.id}`)}
                    className={`border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                      i % 2 !== 0 ? "bg-slate-50 dark:bg-gray-800/50" : ""
                    }`}
                  >
                    <td className="py-4 px-6 font-mono text-xs text-gray-500 dark:text-gray-400">{lic.id}</td>
                    <td className="py-4 px-6 font-medium text-slate-800 dark:text-white">{lic.nombre}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeEstado(lic.estado)}`}>
                        {lic.estado}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{lic.sme}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-primary dark:bg-blue-500 h-2 rounded-full" style={{ width: `${lic.progreso}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{lic.progreso}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{lic.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  )
}