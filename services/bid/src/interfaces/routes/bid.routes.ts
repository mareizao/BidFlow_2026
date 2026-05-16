import { Router } from 'express';
import { BidController } from '../controllers/BidController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
const bidController = new BidController();

// Licitaciones
router.get('/licitaciones', authMiddleware, (req, res) => bidController.getLicitaciones(req as any, res));
router.get('/licitaciones/:id', authMiddleware, (req, res) => bidController.getLicitacionById(req as any, res));
router.post('/licitaciones', authMiddleware, roleMiddleware('admin', 'pre_sales'), (req, res) => bidController.createLicitacion(req as any, res));

// Tareas
router.put('/tareas/:id/completar', authMiddleware, (req, res) => bidController.completarTarea(req as any, res));

// Dashboard
router.get('/dashboard/:userId', authMiddleware, (req, res) => bidController.getDashboard(req as any, res));

export default router;