// src/pages/CrearLicitacion.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { crearLicitacion } from "../api/bidApi"
import { uploadDocumento } from "../api/docApi"
import { useAuth } from "../context/AuthContext"

// Áreas disponibles (deben coincidir con el enum del backend)
const AREAS_DISPONIBLES = [
  { value: "SME", label: "SME - Subject Matter Expert" },
  { value: "finanzas", label: "Finanzas" },
  { value: "juridico", label: "Jurídico / Legal" },
]

export default function CrearLicitacion() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  
  // ✅ Estado adaptado a lo que espera el backend
  const [form, setForm] = useState({
    titulo: "",
    cliente: "",
    fechaCierre: "",
    areas: [],  // Array de strings: ['SME', 'finanzas']
  })
  
  const [archivo, setArchivo] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState("")

  // Manejar cambios en inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  // Manejar selección múltiple de áreas
  const handleAreaChange = (area) => {
    setForm((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)  // Deseleccionar
        : [...prev.areas, area],                 // Seleccionar
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // ✅ Validación con los campos reales del backend
    const { titulo, cliente, fechaCierre, areas } = form
    if (!titulo || !cliente || !fechaCierre || !areas.length) {
      setError("Por favor completa: título, cliente, fecha de cierre y al menos un área.")
      return
    }

    setSubiendo(true)

    try {
      // ✅ Enviar payload exacto que espera el backend
      const licitacionCreada = await crearLicitacion({
        titulo,
        cliente,
        fechaCierre,
        areas,
      })

      console.log("✅ Licitación creada:", licitacionCreada)

      // Subir documento adjunto si existe (usar el ID generado por el backend)
      if (archivo && licitacionCreada?.id) {
        await uploadDocumento(archivo, licitacionCreada.id)
      }

      setExito(true)
      
      // Redirigir al dashboard después de 1.5s
      setTimeout(() => {
        navigate("/", { replace: true })
      }, 1500)
      
    } catch (err) {
      console.error("❌ Error creando licitación:", err)
      
      // Mostrar error específico del backend si existe
      const backendError = err.response?.data?.error
      setError(backendError || "Ocurrió un error al crear la licitación. Intenta nuevamente.")
    } finally {
      setSubiendo(false)
    }
  }

  // Helper para verificar si un área está seleccionada
  const isAreaSelected = (area) => form.areas.includes(area)

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

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Nueva Licitación
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Completa los datos y adjunta el pliego técnico.
        </p>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden transition-colors">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {/* Título de la licitación */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-1">
                Título de la Licitación *
              </label>
              <input
                name="titulo"  // ✅ Coincide con backend
                value={form.titulo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm outline-none focus:border-primary transition-colors"
                placeholder="Ej. Propuesta de Modernización IT - Globant 2026"
                required
              />
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-1">
                Cliente *
              </label>
              <input
                name="cliente"  // ✅ Campo requerido por backend
                value={form.cliente}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm outline-none focus:border-primary transition-colors"
                placeholder="Ej. Globant, Banco XYZ, Ministerio de Salud"
                required
              />
            </div>

            {/* Fecha de cierre */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-1">
                Fecha Límite de Cierre *
              </label>
              <input
                name="fechaCierre"  // ✅ Campo requerido por backend
                type="date"
                value={form.fechaCierre}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm outline-none focus:border-primary transition-colors"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Fecha límite para presentar la propuesta
              </p>
            </div>

            {/* Áreas involucradas (multi-select) */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                Áreas Involucradas *
              </label>
              <div className="space-y-2">
                {AREAS_DISPONIBLES.map((area) => (
                  <label
                    key={area.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isAreaSelected(area.value)
                        ? "bg-blue-50 dark:bg-blue-900/20 border-primary dark:border-blue-400"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isAreaSelected(area.value)}
                      onChange={() => handleAreaChange(area.value)}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm text-slate-800 dark:text-white">
                      {area.label}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Se generarán tareas automáticas para cada área seleccionada
              </p>
            </div>

            {/* Adjuntar pliego técnico (opcional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                Pliego Técnico (PDF, DOCX — Máx. 50MB) <span className="text-gray-400 font-normal">(Opcional)</span>
              </label>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-slate-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer p-10 flex flex-col items-center text-center transition-colors"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <span className="text-3xl mb-3">☁️</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                  {archivo ? archivo.name : "Arrastre y suelte o haga clic para buscar"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">PDF, DOCX hasta 50MB</p>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => setArchivo(e.target.files[0])}
                />
              </div>
            </div>

            {/* Mensajes de error / éxito */}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded">
                ❌ {error}
              </p>
            )}

            {exito && (
              <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded">
                ✅ Licitación creada exitosamente. Redirigiendo...
              </p>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 border border-gray-200 dark:border-gray-600 text-slate-800 dark:text-gray-200 text-sm font-semibold rounded hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={subiendo}
                className="px-6 py-3 bg-primary dark:bg-blue-700 text-white text-sm font-semibold rounded hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {subiendo ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Creando...
                  </>
                ) : (
                  "Crear Licitación"
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}