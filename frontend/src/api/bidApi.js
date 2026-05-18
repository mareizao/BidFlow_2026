import { bidClient } from "./axiosConfig"

// ELIMINAR MOCKS - AHORA CON BACKEND REAL
const USAR_MOCK = false

// Obtener todas las licitaciones
export const getLicitaciones = async (params = {}) => {
  if (USAR_MOCK) {
    const { licitacionesMock } = await import("../mock/data")
    return licitacionesMock
  }
  
  try {
    // Según tu bid-svc, la ruta podría ser /tenders o /licitaciones
    const res = await bidClient.get("/tenders", { params })
    return res.data?.data || res.data || []
  } catch (error) {
    console.error("Error obteniendo licitaciones:", error)
    throw error
  }
}

// Obtener licitación por ID
export const getLicitacionById = async (id) => {
  if (USAR_MOCK) {
    const { licitacionesMock } = await import("../mock/data")
    return licitacionesMock.find((l) => l.id === id)
  }
  
  try {
    const res = await bidClient.get(`/tenders/${id}`)
    return res.data?.data || res.data
  } catch (error) {
    console.error(`Error obteniendo licitación ${id}:`, error)
    throw error
  }
}

// Crear nueva licitación
export const crearLicitacion = async (datos) => {
  if (USAR_MOCK) {
    console.log("Mock: creando licitación", datos)
    return { ...datos, id: `BID-${Date.now()}` }
  }
  
  try {
    const res = await bidClient.post("/tenders", datos)
    return res.data?.data || res.data
  } catch (error) {
    console.error("Error creando licitación:", error)
    throw error
  }
}

// Actualizar licitación
export const actualizarLicitacion = async (id, datos) => {
  try {
    const res = await bidClient.put(`/tenders/${id}`, datos)
    return res.data?.data || res.data
  } catch (error) {
    console.error(`Error actualizando licitación ${id}:`, error)
    throw error
  }
}

// Eliminar licitación
export const eliminarLicitacion = async (id) => {
  try {
    await bidClient.delete(`/tenders/${id}`)
    return { success: true }
  } catch (error) {
    console.error(`Error eliminando licitación ${id}:`, error)
    throw error
  }
}

// Completar tarea (ajusta la ruta según tu backend)
export const completarTarea = async (tareaId) => {
  try {
    const res = await bidClient.patch(`/tasks/${tareaId}/complete`)
    return res.data?.data || res.data
  } catch (error) {
    console.error(`Error completando tarea ${tareaId}:`, error)
    throw error
  }
}

// Obtener estadísticas para dashboard
export const getDashboardStats = async () => {
  try {
    const res = await bidClient.get("/dashboard/stats")
    return res.data?.data || res.data || {
      total: 0,
      abiertas: 0,
      enRevision: 0,
      cerradas: 0,
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return {
      total: 0,
      abiertas: 0,
      enRevision: 0,
      cerradas: 0,
    }
  }
}

// Obtener tareas pendientes
export const getTareasPendientes = async (limit = 5) => {
  try {
    const res = await bidClient.get("/tasks", { params: { status: "pending", limit } })
    return res.data?.data || res.data || []
  } catch (error) {
    console.error("Error obteniendo tareas:", error)
    return []
  }
}