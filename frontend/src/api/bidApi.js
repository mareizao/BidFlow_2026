import { bidClient } from "./axiosConfig"
import { licitacionesMock } from "../mock/data"

const USAR_MOCK = true // Cambia a false cuando el backend esté listo

export const getLicitaciones = async () => {
  if (USAR_MOCK) return licitacionesMock
  const res = await bidClient.get("/licitaciones")
  return res.data
}

export const getLicitacionById = async (id) => {
  if (USAR_MOCK) return licitacionesMock.find((l) => l.id === id)
  const res = await bidClient.get(`/licitaciones/${id}`)
  return res.data
}

export const crearLicitacion = async (datos) => {
  if (USAR_MOCK) {
    console.log("Mock: creando licitación", datos)
    return { ...datos, id: "BID-2023-NEW" }
  }
  const res = await bidClient.post("/licitaciones", datos)
  return res.data
}

export const completarTarea = async (tareaId) => {
  if (USAR_MOCK) {
    console.log("Mock: tarea completada", tareaId)
    return { ok: true }
  }
  const res = await bidClient.put(`/tareas/${tareaId}/completar`)
  return res.data
}