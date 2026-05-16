import axios from "axios"

// Instancia para Auth
export const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
})

// Instancia para Licitaciones
export const bidClient = axios.create({
  baseURL: import.meta.env.VITE_BID_URL,
})

// Instancia para Documentos
export const docClient = axios.create({
  baseURL: import.meta.env.VITE_DOC_URL,
})

// Interceptor: agrega el token JWT a cada request automáticamente
const agregarToken = (config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// Interceptor: si el token expiró, redirige al login
const manejarError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }
  return Promise.reject(error)
}

bidClient.interceptors.request.use(agregarToken)
bidClient.interceptors.response.use((res) => res, manejarError)

docClient.interceptors.request.use(agregarToken)
docClient.interceptors.response.use((res) => res, manejarError)