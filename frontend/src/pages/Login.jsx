import { useState } from "react"
import { useNavigate } from "react-router-dom"

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

    await new Promise((r) => setTimeout(r, 800))

    if (email && password) {
      localStorage.setItem("token", "mock-jwt-token-bidflow")
      navigate("/")
    } else {
      setError("Por favor ingresa email y contraseña.")
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

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
          BidFlow © 2026 — Arquitectura de Software
        </p>
      </div>
    </div>
  )
}