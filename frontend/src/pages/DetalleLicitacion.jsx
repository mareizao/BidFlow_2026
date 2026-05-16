import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { getLicitacionById, completarTarea } from "../api/bidApi"

export default function DetalleLicitacion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lic, setLic] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getLicitacionById(id)
      .then(setLic)
      .finally(() => setCargando(false))
  }, [id])

  const marcarTarea = async (tareaId) => {
    await completarTarea(tareaId)
    setLic((prev) => ({
      ...prev,
      tareas: prev.tareas.map((t) =>
        t.id === tareaId ? { ...t, completada: true } : t
      ),
    }))
  }

  if (cargando) return <p className="text-center pt-32 text-gray-400">Cargando...</p>
  if (!lic) return <p className="text-center pt-32 text-gray-400">Licitación no encontrada.</p>

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
      <Navbar />
      <Sidebar />
      <main className="ml-56 pt-16 p-8">

        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-primary dark:hover:text-blue-400 mb-4 inline-flex items-center gap-1 transition-colors"
        >
          ← Volver al Dashboard
        </button>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 mb-6 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-mono text-gray-400 mb-1">{lic.id}</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lic.nombre}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lic.descripcion}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              lic.estado === "Abierta"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : lic.estado === "En Revisión"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}>
              {lic.estado}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">SME Asignado</p>
              <p className="font-semibold text-slate-800 dark:text-white">{lic.sme}</p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Última actualización</p>
              <p className="font-semibold text-slate-800 dark:text-white">{lic.fecha}</p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Progreso</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-primary dark:bg-blue-500 h-2 rounded-full" style={{ width: `${lic.progreso}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{lic.progreso}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tareas */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 transition-colors">
          <h2 className="text-lg font-semibold text-primary dark:text-blue-400 mb-4">
            Tareas del Proceso
          </h2>
          <div className="space-y-3">
            {lic.tareas.map((tarea) => (
              <div
                key={tarea.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  tarea.completada
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${tarea.completada ? "text-green-500" : "text-gray-300"}`}>
                    {tarea.completada ? "✅" : "⭕"}
                  </span>
                  <span className={`text-sm font-medium ${
                    tarea.completada
                      ? "text-green-700 dark:text-green-400 line-through"
                      : "text-slate-800 dark:text-white"
                  }`}>
                    {tarea.titulo}
                  </span>
                </div>
                {!tarea.completada && (
                  <button
                    onClick={() => marcarTarea(tarea.id)}
                    className="text-xs text-primary dark:text-blue-400 border border-primary dark:border-blue-400 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Marcar completada
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}