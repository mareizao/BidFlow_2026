import { docClient, docUploadClient } from "./axiosConfig"

const USAR_MOCK = false

// Subir documento ✅ (esta ya estaba correcta)
export const uploadDocumento = async (archivo, licitacionId, metadata = {}) => {
  if (USAR_MOCK) {
    console.log("Mock: subiendo archivo", archivo.name, "para", licitacionId)
    return new Promise((resolve) =>
      setTimeout(() => resolve({ 
        ok: true, 
        nombre: archivo.name,
        id: `doc-${Date.now()}` 
      }), 1500)
    )
  }
  
  try {
    const formData = new FormData()
    formData.append("file", archivo)
    formData.append("licitacionId", licitacionId) // ✅ Cambiado de "tenderId" a "licitacionId"
    
    if (metadata.type) formData.append("type", metadata.type)
    if (metadata.category) formData.append("category", metadata.category)
    
    const res = await docUploadClient.post("/upload", formData)
    return res.data?.data || res.data
  } catch (error) {
    console.error("Error subiendo documento:", error)
    throw error
  }
}

// Obtener documentos de una licitación ✅ CORREGIDO
export const getDocumentosByLicitacion = async (licitacionId) => {
  try {
    // ✅ Ruta correcta: /licitacion/:licitacionId
    const res = await docClient.get(`/licitacion/${licitacionId}`)
    return res.data?.data || res.data || []
  } catch (error) {
    console.error(`Error obteniendo documentos de licitación ${licitacionId}:`, error)
    return []
  }
}

// ⚠️ getDocumentoById: Tu backend NO tiene esta ruta
// Opción A: Eliminar esta función si no la usas
// Opción B: Implementarla en el backend si la necesitas
export const getDocumentoById = async (docId) => {
  console.warn("getDocumentoById: Esta ruta no existe en el backend actual")
  // Si tu backend la tuviera, sería algo como:
  // const res = await docClient.get(`/documento/${docId}`)
  // return res.data?.data || res.data
  throw new Error("Ruta no implementada en doc-svc")
}

// Descargar documento ✅ CORREGIDO
export const downloadDocumento = async (docId, nombreArchivo) => {
  if (USAR_MOCK) {
    console.log("Mock: descargando documento", docId)
    return null
  }
  
  try {
    // ✅ Ruta correcta: /download/:id
    const res = await docClient.get(`/download/${docId}`, {
      responseType: "blob",
    })
    
    const blob = new Blob([res.data], { type: res.headers["content-type"] })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", nombreArchivo || `documento_${docId}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    return { success: true }
  } catch (error) {
    console.error(`Error descargando documento ${docId}:`, error)
    throw error
  }
}

// Eliminar documento ✅ CORREGIDO
export const eliminarDocumento = async (docId) => {
  try {
    // ✅ Ruta correcta: /documento/:id
    await docClient.delete(`/documento/${docId}`)
    return { success: true }
  } catch (error) {
    console.error(`Error eliminando documento ${docId}:`, error)
    throw error
  }
}