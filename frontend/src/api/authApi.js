import { authClient } from "./axiosConfig"

export const loginApi = async (email, password) => {
  const response = await authClient.post("/login", { email, password })
  return response.data // { token, usuario }
}