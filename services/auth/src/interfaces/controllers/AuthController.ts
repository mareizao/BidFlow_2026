import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/useCases/LoginUseCase';
import { VerifyTokenUseCase } from '../../application/useCases/VerifyTokenUseCase';
import { LoginRequestDTO } from '../../application/dtos/AuthDTOs';

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

  health = (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    });
  };
}
