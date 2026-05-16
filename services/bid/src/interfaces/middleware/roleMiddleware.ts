import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const roleMiddleware = (...rolesPermitidos: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      res.status(403).json({ error: 'No tienes permisos para esta acción' });
      return;
    }

    next();
  };
};