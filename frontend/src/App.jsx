// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LicitacionDetalle from "./pages/DetalleLicitacion";
import CrearLicitacion from "./pages/CrearLicitacion";
import Documentos from "./pages/Documentos";

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
        path="/crear"
        element={
          <ProtectedRoute>
            <CrearLicitacion />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
