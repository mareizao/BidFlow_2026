import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import DetalleLicitacion from "./pages/DetalleLicitacion"
import CrearLicitacion from "./pages/CrearLicitacion"

const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
          <Route path="/licitacion/:id" element={<RutaProtegida><DetalleLicitacion /></RutaProtegida>} />
          <Route path="/crear" element={<RutaProtegida><CrearLicitacion /></RutaProtegida>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}