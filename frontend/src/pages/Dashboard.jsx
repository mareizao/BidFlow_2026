import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { getLicitaciones, getDashboardStats, getTareasPendientes } from "../api/bidApi"
import { useAuth } from "../contexts/AuthContext"

const badgeEstado = (estado) => {
  // Normalizar estado para comparación
  const estadoLower = (estado || "").toLowerCase()
  
  if (estadoLower === "abierta" || estadoLower === "active" || estadoLower === "open") 
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  if (estadoLower === "en revisión" || estadoLower === "review" || estadoLower === "pending") 
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  if (estadoLower === "cerrada" || estadoLower === "closed" || estadoLower === "completed") 
    return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
  
  return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
}

export default function Dashboard() {
  const [licitaciones, setLicitaciones] = useState([])
  const [stats, setStats] = useState(null)
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const { usuario } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true)
      try {
        // Cargar licitaciones
        const licitacionesData = await getLicitaciones({ limit: 10, sort: "-createdAt" })
        setLicitaciones(licitacionesData)
        
        // Cargar estadísticas
        const statsData = await getDashboardStats()
        setStats(statsData)
        
        // Cargar tareas pendientes
        const tareasData = await getTareasPendientes(5)
        setTareas(tareasData)
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  // Calcular stats si no vienen del backend
  const totalLicitaciones = stats?.total || licitaciones.length
  const abiertas = stats?.abiertas || licitaciones.filter(l => 
    l.estado === "Abierta" || l.status === "active" || l.status === "open"
  ).length
  const enRevision = stats?.enRevision || licitaciones.filter(l => 
    l.estado === "En Revisión" || l.status === "review" || l.status === "pending"
  ).length
  const cerradas = stats?.cerradas || licitaciones.filter(l => 
    l.estado === "Cerrada" || l.status === "closed" || l.status === "completed"
  ).length

  const statsCards = [
    { label: "Total", valor: totalLicitaciones, color: "text-slate-900 dark:text-white" },
    { label: "Abiertas", valor: abiertas, color: "text-green-700 dark:text-green-400" },
    { label: "En Revisión", valor: enRevision, color: "text-yellow-700 dark:text-yellow-400" },
    { label: "Cerradas", valor: cerradas, color: "text-gray-500 dark:text-gray-400" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
      <Navbar />
      <Sidebar />
      <main className="ml-56 pt-16 p-8">
        {/* Bienvenida personalizada */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Bienvenido, {usuario?.name || usuario?.email || "Usuario"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Rol: {usuario?.role || "No especificado"}
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Tablero de Licitaciones
          </h2>
          <button
            onClick={() => navigate("/crear")}
            className="bg-primary text-white text-sm px-4 py-2 rounded font-semibold hover:bg-primary-dark transition-colors"
          >
            + Nueva Licitación
          </button>
        </div>

        {/* Tarjetas estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 transition-colors">
              <p className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2">
                {s.label}
              </p>
              <p className={`text-4xl font-bold ${s.color}`}>{s.valor}</p>
            </div>
          ))}
        </div>

        {/* Sección de tareas pendientes */}
        {tareas.length > 0 && (
          <div className="mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-primary dark:text-blue-400">
                Tareas Pendientes
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {tareas.map((tarea) => (
                <div key={tarea.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                        {tarea.title || tarea.nombre}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tarea.description || tarea.descripcion}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {tarea.dueDate && (
                        <span>Vence: {new Date(tarea.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabla de licitaciones */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-primary dark:text-blue-400">
              Licitaciones Recientes
            </h2>
          </div>

          {cargando ? (
            <p className="text-center py-12 text-gray-400">Cargando licitaciones...</p>
          ) : licitaciones.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No hay licitaciones disponibles</p>
              <button
                onClick={() => navigate("/crear")}
                className="mt-4 text-primary hover:text-primary-dark text-sm"
              >
                Crear primera licitación
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                      <td className="py-4 px-6 font-mono text-xs text-gray-500 dark:text-gray-400">
                        {lic.id || lic.bidId}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800 dark:text-white">
                        {lic.title || lic.nombre}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeEstado(lic.estado || lic.status)}`}>
                          {lic.estado || lic.status || "Activa"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                        {lic.sme || lic.assignedTo || "No asignado"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-primary dark:bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${lic.progreso || lic.progress || 0}%` }} 
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {lic.progreso || lic.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                        {lic.fecha || (lic.updatedAt && new Date(lic.updatedAt).toLocaleDateString()) || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}