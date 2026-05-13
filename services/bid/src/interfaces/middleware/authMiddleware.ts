import { Request, Response, NextFunction } from 'express';
import { authClient } from '../../infrastructure/http/AuthClient';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    nombre: string;
    rol: string;
    area: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ error: 'Token no proporcionado' });
      return;
    }

    const user = await authClient.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};