import { docClient } from "./axiosConfig"

const USAR_MOCK = true

export const uploadDocumento = async (archivo, licitacionId) => {
  if (USAR_MOCK) {
    console.log("Mock: subiendo archivo", archivo.name, "para", licitacionId)
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ok: true, nombre: archivo.name }), 1500)
    )
  }
  const formData = new FormData()
  formData.append("file", archivo)
  formData.append("licitacionId", licitacionId)
  const res = await docClient.post("/upload", formData)
  return res.data
}

export const downloadDocumento = async (docId) => {
  if (USAR_MOCK) {
    console.log("Mock: descargando documento", docId)
    return null
  }
  const res = await docClient.get(`/download/${docId}`, {
    responseType: "blob",
  })
  return res.data
}