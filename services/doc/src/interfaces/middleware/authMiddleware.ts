import { Request, Response, NextFunction } from 'express';
import { AuthClient } from '../../infrastructure/http/AuthClient';

const authClient = new AuthClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: string;
    area: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }

  try {
    const user = await authClient.verifyToken(authHeader);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
