// src/api/bidApi.js
import { bidClient } from "./axiosConfig"

const USAR_MOCK = false

// Obtener todas las licitaciones ✅ CORREGIDO
export const getLicitaciones = async (params = {}) => {
  if (USAR_MOCK) {
    const { licitacionesMock } = await import("../mock/data")
    return licitacionesMock
  }
  
  try {
    // ✅ Ruta correcta: /licitaciones
    const res = await bidClient.get("/licitaciones", { params })
    
    // Backend devuelve: { licitaciones: [...], total, page, limit }
    return res.data?.licitaciones || res.data?.data || res.data || []
  } catch (error) {
    console.error("Error obteniendo licitaciones:", error)
    throw error
  }
}

// Obtener licitación por ID ✅ CORREGIDO
export const getLicitacionById = async (id) => {
  if (USAR_MOCK) {
    const { licitacionesMock } = await import("../mock/data")
    return licitacionesMock.find((l) => l.id === id)
  }
  
  try {
    // ✅ Ruta correcta: /licitaciones/:id
    const res = await bidClient.get(`/licitaciones/${id}`)
    
    // Backend devuelve el objeto directo: { id, titulo, cliente, ... }
    return res.data || res.data?.data
  } catch (error) {
    console.error(`Error obteniendo licitación ${id}:`, error)
    throw error
  }
}

// Crear nueva licitación ✅ CORREGIDO
export const crearLicitacion = async (datos) => {
  if (USAR_MOCK) {
    console.log("Mock: creando licitación", datos)
    return { ...datos, id: `BID-${Date.now()}` }
  }
  
  try {
    // ✅ Backend espera: { titulo, cliente, fechaCierre, areas }
    const payload = {
      titulo: datos.titulo || datos.nombre,  // Adaptar si viene como "nombre"
      cliente: datos.cliente,
      fechaCierre: datos.fechaCierre,
      areas: datos.areas || []
    }
    
    const res = await bidClient.post("/licitaciones", payload)
    
    // Backend devuelve el objeto creado directo
    return res.data || res.data?.data
  } catch (error) {
    console.error("Error creando licitación:", error)
    throw error
  }
}

// Completar tarea ✅ CORREGIDO
export const completarTarea = async (tareaId) => {
  try {
    // ✅ Ruta correcta: PUT /tareas/:id/completar
    const res = await bidClient.put(`/tareas/${tareaId}/completar`)
    
    // Backend devuelve: { tarea, licitacionActualizada }
    return res.data?.tarea || res.data?.data || res.data
  } catch (error) {
    console.error(`Error completando tarea ${tareaId}:`, error)
    throw error
  }
}

// Obtener estadísticas para dashboard ✅ CORREGIDO CON ADAPTADOR
export const getDashboardStats = async (userId) => {
  try {
    const usuarioStr = localStorage.getItem("usuario")
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null
    const targetUserId = userId || usuario?.id
    
    if (!targetUserId) {
      return { total: 0, abiertas: 0, enRevision: 0, cerradas: 0 }
    }
    
    // ✅ Ruta correcta: /dashboard/:userId
    const res = await bidClient.get(`/dashboard/${targetUserId}`)
    const data = res.data || res.data?.data || {}
    
    // 🔄 ADAPTAR: Backend → Frontend
    const stats = data.estadisticas || data
    return {
      total: stats.totalLicitaciones || stats.total || 0,
      abiertas: stats.activas || stats.open || stats.abiertas || 0,  // Backend: "activas"
      enRevision: stats.enRevision || stats.review || 0,  // Si backend no lo tiene, calcular después
      cerradas: stats.completadas || stats.closed || stats.cerradas || 0,  // Backend: "completadas"
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return { total: 0, abiertas: 0, enRevision: 0, cerradas: 0 }
  }
}

// Obtener tareas pendientes ✅ USANDO DASHBOARD
export const getTareasPendientes = async (limit = 5) => {
  try {
    const usuarioStr = localStorage.getItem("usuario")
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null
    
    if (!usuario?.id) return []
    
    // ✅ Usar el endpoint /dashboard que ya incluye tareasAsignadas
    const res = await bidClient.get(`/dashboard/${usuario.id}`)
    const data = res.data || res.data?.data || {}
    
    // Backend devuelve: { tareasAsignadas: [...] }
    const tareas = data.tareasAsignadas || data.tareas || []
    
    // Filtrar solo las pendientes y limitar
    return tareas
      .filter((t) => t.estado === "pendiente" || t.status === "pending")
      .slice(0, limit)
  } catch (error) {
    console.error("Error obteniendo tareas:", error)
    return []
  }
}

// Actualizar licitación (opcional)
export const actualizarLicitacion = async (id, datos) => {
  try {
    const res = await bidClient.put(`/licitaciones/${id}`, datos)
    return res.data || res.data?.data
  } catch (error) {
    console.error(`Error actualizando licitación ${id}:`, error)
    throw error
  }
}

// Eliminar licitación (opcional)
export const eliminarLicitacion = async (id) => {
  try {
    await bidClient.delete(`/licitaciones/${id}`)
    return { success: true }
  } catch (error) {
    console.error(`Error eliminando licitación ${id}:`, error)
    throw error
  }
}