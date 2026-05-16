import { Request, Response, NextFunction } from 'express';
import { authClient } from '../../infrastructure/http/AuthClient';
import logger from '../../infrastructure/logger';

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
      logger.warn('Intento de acceso sin token', { path: req.path });
      res.status(401).json({ error: 'Token no proporcionado' });
      return;
    }

    const user = await authClient.verifyToken(token);
    req.user = user;
    logger.debug('Usuario autenticado', { userId: user.id, rol: user.rol });
    next();
  } catch (error: any) {
    logger.warn('Token inválido o expirado', { error: error.message, path: req.path });
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};