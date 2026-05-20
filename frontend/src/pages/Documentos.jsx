// src/pages/Documentos.jsx
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { getMisDocumentos } from "../api/docApi"
import { getLicitaciones } from "../api/bidApi"

export default function Documentos() {
  const [documentos, setDocumentos] = useState([])
  const [licitacionesMap, setLicitacionesMap] = useState({})
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true)
      try {
        // 1. Obtener documentos del usuario actual
        const docsData = await getMisDocumentos()
        setDocumentos(docsData)

        // 2. Obtener licitaciones para mapear títulos (evita mostrar solo UUIDs)
        const licsData = await getLicitaciones({ limit: 100 })
        
        // Crear mapa rápido: { "uuid-licitacion": "Título" }
        const mapaTitulos = {}
        licsData.forEach((lic) => {
          mapaTitulos[lic.id] = lic.titulo || lic.nombre || "Sin título"
        })
        setLicitacionesMap(mapaTitulos)
      } catch (error) {
        console.error("Error cargando documentos:", error)
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  // Helper para formatear tamaño
  const formatSize = (bytes) => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
      <Navbar />
      <Sidebar />
      <main className="ml-56 pt-16 p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Mis Documentos
        </h1>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
          {cargando ? (
            <div className="p-12 text-center text-gray-500">Cargando documentos...</div>
          ) : documentos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No has subido documentos aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-4 px-6 text-xs font-semibold tracking-widest text-primary dark:text-blue-400 uppercase">Documento</th>
                    <th className="py-4 px-6 text-xs font-semibold tracking-widest text-primary dark:text-blue-400 uppercase">Licitación Asociada</th>
                    <th className="py-4 px-6 text-xs font-semibold tracking-widest text-primary dark:text-blue-400 uppercase">Tamaño</th>
                    <th className="py-4 px-6 text-xs font-semibold tracking-widest text-primary dark:text-blue-400 uppercase">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {documentos.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📄</span>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-white text-sm">{doc.filename}</p>
                            <p className="text-xs text-gray-400">{doc.mimeType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-gray-300">
                        {licitacionesMap[doc.licitacionId] || (
                          <span className="text-xs font-mono text-gray-400">ID: {doc.licitacionId?.slice(0, 8)}...</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-gray-300">
                        {formatSize(doc.fileSize)}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-gray-300">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
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