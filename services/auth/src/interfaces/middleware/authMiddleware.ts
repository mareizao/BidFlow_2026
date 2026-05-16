import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../infrastructure/jwt/JwtService';

const jwtService = new JwtService();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    nombre: string;
    rol: string;
    area: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwtService.verify(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
