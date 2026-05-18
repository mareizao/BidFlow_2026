import axios from "axios"

// Configuración según tus servidores
export const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 30000,
})

export const bidClient = axios.create({
  baseURL: import.meta.env.VITE_BID_URL,
  timeout: 30000,
})

export const docClient = axios.create({
  baseURL: import.meta.env.VITE_DOC_URL,
  timeout: 30000,
})

// Cliente para uploads de documentos
export const docUploadClient = axios.create({
  baseURL: import.meta.env.VITE_DOC_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
})

// Interceptor para agregar token
const agregarToken = (config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// Interceptor para manejar errores 401
const manejarError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login"
    }
  }
  return Promise.reject(error)
}

// Aplicar interceptors a los clientes que requieren auth
bidClient.interceptors.request.use(agregarToken)
bidClient.interceptors.response.use((res) => res, manejarError)

docClient.interceptors.request.use(agregarToken)
docClient.interceptors.response.use((res) => res, manejarError)

docUploadClient.interceptors.request.use(agregarToken)
docUploadClient.interceptors.response.use((res) => res, manejarError)

// Auth client no necesita token para login, pero sí manejar errores
authClient.interceptors.response.use((res) => res, manejarError)