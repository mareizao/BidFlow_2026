// src/main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"  // ← AGREGAR: Importar ThemeProvider
import "./index.css"

// Capturar errores no manejados
window.addEventListener('error', (event) => {
  console.error('🔴 Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 Unhandled promise rejection:', event.reason)
})

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    {/* 🎨 ThemeProvider debe ser el más externo para que todos los componentes accedan al tema */}
    <ThemeProvider>
      {/* 🔐 AuthProvider dentro para que pueda usar el tema si lo necesita */}
      <AuthProvider>
        {/* 🧭 BrowserRouter al final para que useAuth y useTheme ya estén disponibles */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)