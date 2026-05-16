import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { crearLicitacion } from "../api/bidApi"
import { uploadDocumento } from "../api/docApi"

export default function CrearLicitacion() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: "", id: "", sme: "" })
  const [archivo, setArchivo] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.id || !form.sme) {
      setError("Por favor completa todos los campos.")
      return
    }
    setError("")
    setSubiendo(true)

    try {
      await crearLicitacion(form)
      if (archivo) await uploadDocumento(archivo, form.id)
      setExito(true)
      setTimeout(() => navigate("/"), 1500)
    } catch (err) {
      setError("Ocurrió un error. Intenta nuevamente.")
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
      <Navbar />
      <Sidebar />
      <main className="ml-56 pt-16 p-8">
        <div className="max-w-2xl mx-auto">

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

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-1">
                    Nombre de la Licitación
                  </label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Ej. Modernización IT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-1">
                    ID de la Licitación
                  </label>
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Ej. BID-2024-001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-1">
                  SME Responsable
                </label>
                <select
                  name="sme"
                  value={form.sme}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm outline-none focus:border-primary bg-white dark:bg-gray-700 transition-colors"
                >
                  <option value="">Seleccione un responsable</option>
                  <option>Carlos Ruiz - IT</option>
                  <option>Elena Vásquez - Legal</option>
                  <option>Roberto Gómez - Operaciones</option>
                  <option>Laura Torres - Finanzas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                  Pliego Técnico (PDF, DOCX — Máx. 50MB)
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

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded">
                  {error}
                </p>
              )}

              {exito && (
                <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded">
                  ✅ Licitación creada exitosamente. Redirigiendo...
                </p>
              )}

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
                  className="px-6 py-3 bg-primary dark:bg-blue-700 text-white text-sm font-semibold rounded hover:bg-primary-dark transition-colors disabled:opacity-60"
                >
                  {subiendo ? "Cargando..." : "Crear Licitación"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  )
}