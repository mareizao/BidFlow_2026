import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AUTH_SVC_URL = process.env.AUTH_SVC_URL || 'http://localhost:3001';

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  area: string;
}

export class AuthClient {
  async verifyToken(token: string): Promise<AuthUser> {
    const { data } = await axios.get(`${AUTH_SVC_URL}/verify`, {
      headers: { Authorization: token },
    });
    return data;
  }

  async getUsersByRol(rol: string): Promise<AuthUser[]> {
    const { data } = await axios.get(`${AUTH_SVC_URL}/users`, {
      params: { rol },
    });
    return data;
  }
}

export const authClient = new AuthClient();