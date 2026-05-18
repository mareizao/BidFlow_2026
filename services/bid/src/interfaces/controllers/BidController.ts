import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { CreateLicitacionUseCase } from '../../application/tempCases/CreateLicitacionUseCase';
import { GetLicitacionesUseCase } from '../../application/tempCases/GetLicitacionesUseCase';
import { GetLicitacionByIdUseCase } from '../../application/tempCases/GetLicitacionByIdUseCase';
import { CompletarTareaUseCase } from '../../application/tempCases/CompletarTareaUseCase';
import { GetDashboardUseCase } from '../../application/tempCases/GetDashboardUseCase';
import { PrismaLicitacionRepository } from '../../infrastructure/database/PrismaLicitacionRepository';
import { PrismaTareaRepository } from '../../infrastructure/database/PrismaTareaRepository';
import { authClient } from '../../infrastructure/http/AuthClient';

// Instanciar repositorios
const licitacionRepository = new PrismaLicitacionRepository();
const tareaRepository = new PrismaTareaRepository();

// Instanciar casos de uso
const createLicitacionUseCase = new CreateLicitacionUseCase(
  licitacionRepository,
  tareaRepository,
  authClient
);
const getLicitacionesUseCase = new GetLicitacionesUseCase(licitacionRepository);
const getLicitacionByIdUseCase = new GetLicitacionByIdUseCase(licitacionRepository);
const completarTareaUseCase = new CompletarTareaUseCase(tareaRepository, licitacionRepository);
const getDashboardUseCase = new GetDashboardUseCase(licitacionRepository, tareaRepository);

export class BidController {
  // POST /licitaciones
  async createLicitacion(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { titulo, cliente, fechaCierre, areas } = req.body;

      if (!titulo || !cliente || !fechaCierre || !areas || !areas.length) {
        res.status(400).json({ error: 'Faltan campos requeridos: titulo, cliente, fechaCierre, areas' });
        return;
      }

      const result = await createLicitacionUseCase.execute(
        { titulo, cliente, fechaCierre, areas },
        req.user!.id
      );

      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /licitaciones
  async getLicitaciones(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { estado, page, limit } = req.query;

      const result = await getLicitacionesUseCase.execute(
        {
          estado: estado as string,
          page: page ? parseInt(page as string) : 1,
          limit: limit ? parseInt(limit as string) : 10,
        },
        {
          userId: req.user!.id,
          userRol: req.user!.rol,
          userArea: req.user!.area,
        }
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /licitaciones/:id
  async getLicitacionById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await getLicitacionByIdUseCase.execute(id);

      if (!result) {
        res.status(404).json({ error: 'Licitación no encontrada' });
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /tareas/:id/completar
  async completarTarea(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await completarTareaUseCase.execute(id, req.user!.id);

      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Tarea no encontrada') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'No tienes permiso para completar esta tarea') {
        res.status(403).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  // GET /dashboard/:userId
  async getDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const result = await getDashboardUseCase.execute({
        userId,
        userRol: req.user!.rol,
        userArea: req.user!.area,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}