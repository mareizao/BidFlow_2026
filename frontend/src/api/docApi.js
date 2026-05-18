import { docClient, docUploadClient } from "./axiosConfig"

const USAR_MOCK = false

// Subir documento
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
    formData.append("tenderId", licitacionId)
    
    if (metadata.type) formData.append("type", metadata.type)
    if (metadata.category) formData.append("category", metadata.category)
    
    // Ruta según tu doc-svc
    const res = await docUploadClient.post("/upload", formData)
    return res.data?.data || res.data
  } catch (error) {
    console.error("Error subiendo documento:", error)
    throw error
  }
}

// Obtener documentos de una licitación
export const getDocumentosByLicitacion = async (licitacionId) => {
  try {
    const res = await docClient.get(`/documents/tender/${licitacionId}`)
    return res.data?.data || res.data || []
  } catch (error) {
    console.error(`Error obteniendo documentos de licitación ${licitacionId}:`, error)
    return []
  }
}

// Obtener documento por ID
export const getDocumentoById = async (docId) => {
  try {
    const res = await docClient.get(`/documents/${docId}`)
    return res.data?.data || res.data
  } catch (error) {
    console.error(`Error obteniendo documento ${docId}:`, error)
    throw error
  }
}

// Descargar documento
export const downloadDocumento = async (docId, nombreArchivo) => {
  if (USAR_MOCK) {
    console.log("Mock: descargando documento", docId)
    return null
  }
  
  try {
    const res = await docClient.get(`/documents/${docId}/download`, {
      responseType: "blob",
    })
    
    // Crear link de descarga
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

// Eliminar documento
export const eliminarDocumento = async (docId) => {
  try {
    await docClient.delete(`/documents/${docId}`)
    return { success: true }
  } catch (error) {
    console.error(`Error eliminando documento ${docId}:`, error)
    throw error
  }
}