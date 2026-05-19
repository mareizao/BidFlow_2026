// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, roles = [] }) => {
  // ✅ Nombres correctos según tu AuthContext
  const { isAuthenticated, cargando, tieneRol } = useAuth()

  if (cargando) {  // ← no "loading"
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // ← tieneRol, no hasRole
  if (roles.length > 0 && !tieneRol(roles)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute