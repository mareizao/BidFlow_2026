import jwt from 'jsonwebtoken';
import { UserPublic } from '../../domain/entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export interface JwtPayload extends UserPublic {
  iat?: number;
  exp?: number;
}

export class JwtService {
  sign(user: UserPublic): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  verify(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return payload;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}
