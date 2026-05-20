// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LicitacionDetalle from "./pages/DetalleLicitacion";
import CrearLicitacion from "./pages/CrearLicitacion";
import Documentos from "./pages/Documentos";

// ✅ ProtectedRoute con soporte para roles
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, cargando, usuario } = useAuth();

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si se especifican roles requeridos, verificar
  if (roles.length > 0 && usuario) {
    const userRol = usuario.rol || usuario.role;
    if (!roles.includes(userRol)) {
      // Redirigir al dashboard si no tiene permiso
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas - acceso para todos los roles autenticados */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/licitacion/:id"
        element={
          <ProtectedRoute>
            <LicitacionDetalle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pliegos"
        element={
          <ProtectedRoute>
            <Documentos />
          </ProtectedRoute>
        }
      />

      {/* ✅ Ruta protegida por rol: solo admin y pre_sales pueden crear */}
      <Route
        path="/crear"
        element={
          <ProtectedRoute roles={["admin", "pre_sales"]}>
            <CrearLicitacion />
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;