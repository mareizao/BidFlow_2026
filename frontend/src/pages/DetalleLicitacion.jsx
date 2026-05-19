// src/pages/DetalleLicitacion.jsx - CORREGIDO

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { getLicitacionById, completarTarea } from "../api/bidApi"
import { useAuth } from "../context/AuthContext"  // ← Agregar para obtener userId

export default function DetalleLicitacion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()  // ← Obtener usuario actual
  const [lic, setLic] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getLicitacionById(id)
      .then((data) => {
        console.log("📦 Licitación recibida:", data)  // ← Debug
        setLic(data)
      })
      .catch((err) => {
        console.error("❌ Error cargando licitación:", err)
      })
      .finally(() => setCargando(false))
  }, [id])

  const marcarTarea = async (tareaId) => {
    try {
      await completarTarea(tareaId)
      
      // ✅ Actualizar estado localmente
      setLic((prev) => ({
        ...prev,
        tareas: prev.tareas.map((t) =>
          t.id === tareaId ? { ...t, estado: "completada" } : t
        ),
        // ✅ Recalcular progreso
        porcentajeAvance: prev.porcentajeAvance + Math.round(100 / prev.tareas.length)
      }))
    } catch (error) {
      console.error("❌ Error completando tarea:", error)
      alert("No se pudo completar la tarea")
    }
  }

  if (cargando) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-400">Cargando...</p>
    </div>
  )
  
  if (!lic) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-400">Licitación no encontrada.</p>
    </div>
  )

  // ✅ Badge de estado dinámico
  const getEstadoBadge = (estado) => {
    const estados = {
      borrador: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
      en_revision: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      aprobada: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cerrada: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    }
    return estados[estado] || estados.borrador
  }

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

        {/* Header de la licitación */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 mb-6 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-mono text-gray-400 mb-1">{lic.id}</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {lic.titulo || lic.nombre || "Sin título"}  {/* ✅ Soportar ambos */}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Cliente: {lic.cliente || "No especificado"}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(lic.estado)}`}>
              {lic.estado?.replace("_", " ").toUpperCase() || "BORRADOR"}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Fecha Cierre</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                {lic.fechaCierre ? new Date(lic.fechaCierre).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Última actualización</p>
              <p className="font-semibold text-slate-800 dark:text-white">
                {lic.updatedAt ? new Date(lic.updatedAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Progreso</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary dark:bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${lic.porcentajeAvance || lic.progreso || 0}%` }} 
                  />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  {lic.porcentajeAvance || lic.progreso || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tareas */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 transition-colors">
          <h2 className="text-lg font-semibold text-primary dark:text-blue-400 mb-4">
            Tareas del Proceso ({lic.tareas?.filter(t => t.estado === "completada").length || 0}/{lic.tareas?.length || 0})
          </h2>
          
          {lic.tareas && lic.tareas.length > 0 ? (
            <div className="space-y-3">
              {lic.tareas.map((tarea) => {
                const esResponsable = usuario?.id === tarea.responsableId
                const estaCompletada = tarea.estado === "completada"
                
                return (
                  <div
                    key={tarea.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      estaCompletada
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${estaCompletada ? "text-green-500" : "text-gray-300"}`}>
                        {estaCompletada ? "✅" : "⭕"}
                      </span>
                      <div>
                        <span className={`text-sm font-medium ${
                          estaCompletada
                            ? "text-green-700 dark:text-green-400 line-through"
                            : "text-slate-800 dark:text-white"
                        }`}>
                          {/* ✅ Mostrar área como título de la tarea */}
                          Tarea {tarea.area?.toUpperCase() || "Sin área"}
                        </span>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Responsable: {tarea.responsableId ? "Asignado" : "Sin asignar"}
                        </p>
                      </div>
                    </div>
                    
                    {!estaCompletada && esResponsable && (
                      <button
                        onClick={() => marcarTarea(tarea.id)}
                        className="text-xs text-primary dark:text-blue-400 border border-primary dark:border-blue-400 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Marcar completada
                      </button>
                    )}
                    
                    {!esResponsable && !estaCompletada && (
                      <span className="text-xs text-gray-400">
                        No eres el responsable
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No hay tareas registradas para esta licitación</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}