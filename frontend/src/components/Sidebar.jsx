import { NavLink } from "react-router-dom"

const links = [
  { to: "/", label: "Dashboard", icono: "📊" },
  { to: "/crear", label: "Nueva Licitación", icono: "➕" },
  { to: "/pliegos", label: "Documentos", icono: "📄" },
]

export default function Sidebar() {
  return (
    <aside className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col py-6 w-56 fixed left-0 top-16 h-full z-30 transition-colors duration-300">
      <div className="px-5 pb-4 mb-2 border-b border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          Menú Principal
        </p>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `px-4 py-3 flex items-center gap-3 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-gray-700 text-primary border-l-4 border-primary rounded-r"
                  : "text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800"
              }`
            }
          >
            <span>{link.icono}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}