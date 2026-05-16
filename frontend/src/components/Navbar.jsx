import { useTheme } from "../context/ThemeContext"

export default function Navbar() {
const { darkMode, toggleDarkMode } = useTheme()
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center h-16 px-6 w-full fixed top-0 z-40 transition-colors duration-300">

      <img
        src="/logo_bf.png"
        alt="BidFlow Logo"
        style={{ height: "140px", width: "auto", marginLeft: "-35px" }}
        className="object-contain"
      />

      <div className="flex-1 max-w-md mx-8">
        <input
          className="w-full px-4 py-2 bg-slate-100 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 rounded text-sm outline-none focus:border-primary transition-colors"
          placeholder="Buscar licitación..."
          type="text"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors text-lg"
          title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-600">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            AG
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-white">
            Ana García
          </span>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token")
            window.location.href = "/login"
          }}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Salir
        </button>
      </div>

    </nav>
  )
}