// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react"
import { getUsuarioActual, verificarToken, logout as logoutApi } from "../api/authApi"

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const inicializarAuth = async () => {
      const usuarioGuardado = getUsuarioActual()
      
      if (usuarioGuardado) {
        // Verificar si el token sigue siendo válido
        const resultado = await verificarToken()
        if (resultado.valid) {
          setUsuario(resultado.usuario || usuarioGuardado)
        } else {
          // Token inválido, limpiar
          logoutApi()
        }
      }
      
      setCargando(false)
    }

    inicializarAuth()
  }, [])

  const login = (usuarioData) => {
    setUsuario(usuarioData)
  }

  const logout = () => {
    logoutApi()
    setUsuario(null)
  }

  const tieneRol = (roles) => {
    if (!usuario) return false
    if (typeof roles === "string") return usuario.role === roles
    return roles.includes(usuario.role)
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      cargando,
      login,
      logout,
      tieneRol,
      isAuthenticated: !!usuario,
    }}>
      {children}
    </AuthContext.Provider>
  )
}