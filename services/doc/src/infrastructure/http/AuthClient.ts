import axios from 'axios';

export interface AuthUser {
  id: string;
  email: string;
  rol: string;
  area: string;
}

export class AuthClient {
  private readonly authSvcUrl: string;

  constructor() {
    this.authSvcUrl = process.env.AUTH_SVC_URL || 'http://auth-svc:3001';
  }

  async verifyToken(authHeader: string): Promise<AuthUser> {
    const { data } = await axios.get(`${this.authSvcUrl}/verify`, {
      headers: { Authorization: authHeader },
    });

    return data as AuthUser;
  }
}
