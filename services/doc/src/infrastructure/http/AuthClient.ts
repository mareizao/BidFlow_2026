import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AUTH_SVC_URL = process.env.AUTH_SVC_URL || 'http://localhost:3001';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

export interface AuthUser {
  id: string;
  email: string;
  rol: string;
  area: string;
}

export class AuthClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: AUTH_SVC_URL,
      timeout: TIMEOUT_MS,
    });
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && this.isRetryable(error)) {
        console.warn(
          `Reintentando llamada a auth-svc. Intentos restantes: ${retries}`,
          { error: error.message }
        );
        await this.delay(500);
        return this.withRetry(fn, retries - 1);
      }
      throw error;
    }
  }

  private isRetryable(error: any): boolean {
    if (error.response) {
      return error.response.status >= 500;
    }
    return (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNRESET'
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async verifyToken(token: string): Promise<AuthUser> {
    return this.withRetry(async () => {
      const { data } = await this.client.get('/verify', {
        headers: { Authorization: token },
      });
      return data as AuthUser;
    });
  }
}

