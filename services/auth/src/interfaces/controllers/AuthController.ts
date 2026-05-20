// services/auth/src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/useCases/LoginUseCase';
import { VerifyTokenUseCase } from '../../application/useCases/VerifyTokenUseCase';
import { LoginRequestDTO } from '../../application/dtos/AuthDTOs';
import { PrismaClient, Rol } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Helper para validar que el string sea un valor válido del enum Rol
const isValidRol = (value: string): value is Rol => {
  return Object.values(Rol).includes(value as Rol);
};

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyTokenUseCase: VerifyTokenUseCase,
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: LoginRequestDTO = req.body;

      if (!dto.email || !dto.password) {
        res.status(400).json({ error: 'Email y contraseña son requeridos' });
        return;
      }

      const result = await this.loginUseCase.execute(dto);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Credenciales inválidas') {
        res.status(401).json({ error: error.message });
        return;
      }
      console.error('[AuthController.login]', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  verify = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token no proporcionado' });
        return;
      }

      const token = authHeader.split(' ')[1];
      const user = await this.verifyTokenUseCase.execute(token);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Token inválido o expirado' || error.message === 'Usuario no encontrado') {
          res.status(401).json({ error: error.message });
          return;
        }
      }
      console.error('[AuthController.verify]', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // ✅ GET /users?rol=xyz - CORREGIDO
  getUsersByRol = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rol } = req.query;
      
      // Validar que el parámetro exista y sea string
      if (!rol || typeof rol !== 'string') {
        res.status(400).json({ error: 'Parámetro "rol" requerido y debe ser string' });
        return;
      }

      // ✅ Validar que el valor sea uno de los enums permitidos
      if (!isValidRol(rol)) {
        res.status(400).json({ 
          error: `Rol inválido. Valores permitidos: ${Object.values(Rol).join(', ')}` 
        });
        return;
      }

      // ✅ Ahora Prisma acepta `rol` porque TypeScript sabe que es del tipo Rol
      const users = await prisma.user.findMany({
        where: { rol }, // ✅ Tipo correcto: Rol enum
        select: {
          id: true,
          email: true,
          nombre: true,
          rol: true,
          area: true,
        },
      });

      res.status(200).json(users);
    } catch (error: any) {
      console.error('[AuthController.getUsersByRol]', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  health = (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    });
  };
}