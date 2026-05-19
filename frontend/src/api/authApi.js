import { authClient } from "./axiosConfig"

export const loginApi = async (email, password) => {
  try {
    // Según tu auth-svc, la ruta podría ser /login (sin /auth/)
    const response = await authClient.post("/login", { email, password })
    
    // Tu backend debería devolver algo como:
    // { token: "jwt-token", user: { id, email, role, name } }
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token)
      
      // ✅ Asegurar que se guarda el usuario con los campos en español
      const user = response.data.user || response.data.usuario
      const usuarioNormalizado = {
        id: user?.id,
        email: user?.email,
        nombre: user?.nombre || user?.name,  // Soportar ambos
        rol: user?.rol || user?.role,        // Soportar ambos
        area: user?.area,
      }
      
      console.log("👤 Usuario normalizado:", usuarioNormalizado) // ← Log temporal para debug
      localStorage.setItem("usuario", JSON.stringify(usuarioNormalizado))
      
      return { success: true, data: response.data, usuario: usuarioNormalizado }
    }
  }catch (error) {
    console.error("Error en login:", error)
    return { 
      success: false, 
      error: error.response?.data?.error || "Error de autenticación" 
    }
  }
}

// Verificar token (si tienes esta ruta en auth-svc)
export const verificarToken = async () => {
  try {
    const token = localStorage.getItem("token")
    if (!token) return { valid: false }
    
    // Si tienes un endpoint /verify en auth-svc
    const response = await authClient.get("/verify")
    return { valid: true, usuario: response.data?.user }
  } catch (error) {
    // Si no hay endpoint /verify, asumimos que el token es válido si existe
    // y obtenemos el usuario del localStorage
    const usuario = getUsuarioActual()
    return { valid: !!usuario, usuario }
  }
}

export const getUsuarioActual = () => {
  const usuarioStr = localStorage.getItem("usuario")
  if (!usuarioStr) return null
  try {
    return JSON.parse(usuarioStr)
  } catch {
    return null
  }
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("usuario")
}

// Si tienes endpoint para cambiar contraseña
export const cambiarPassword = async (oldPassword, newPassword) => {
  try {
    const response = await authClient.post("/change-password", {
      oldPassword,
      newPassword,
    })
    return { success: true, message: response.data?.message }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || "Error al cambiar contraseña" 
    }
  }
}