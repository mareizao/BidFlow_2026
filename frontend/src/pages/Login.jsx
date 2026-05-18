import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginApi } from "../api/authApi"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    // Validación básica
    if (!email || !password) {
      setError("Por favor ingresa email y contraseña.")
      setCargando(false)
      return
    }

    // Login real con backend
    const result = await loginApi(email, password)

    if (result.success) {
      // Redirigir al dashboard
      navigate("/")
    } else {
      setError(result.error || "Credenciales inválidas. Por favor intenta nuevamente.")
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tighter text-primary dark:text-blue-400 mb-1">
            BidFlow
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Gestión de Licitaciones
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm outline-none focus:border-primary transition-colors"
              placeholder="usuario@globant.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3 bg-primary dark:bg-blue-700 text-white text-sm font-semibold rounded hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {cargando ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Usuarios de prueba (solo para desarrollo) */}
        {import.meta.env.DEV && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Usuarios de prueba:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>📧 admin@bidflow.com / admin123</p>
              <p>📧 presales@bidflow.com / presales123</p>
              <p>📧 sme@bidflow.com / sme123</p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
          BidFlow © 2026 — Arquitectura de Software
        </p>
      </div>
    </div>
  )
}