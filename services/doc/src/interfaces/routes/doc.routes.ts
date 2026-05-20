// src/interfaces/routes/doc.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { DocController } from '../controllers/DocController';

const router = Router();
const controller = new DocController();

// ✅ POST /upload - Esta SÍ está implementada
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  (req, res) => controller.upload(req as any, res)
);

// ✅ GET /documentos - Lista los documentos del usuario autenticado
router.get(
  '/documentos',
  authMiddleware,
  (req, res) => controller.getMisDocumentos(req as any, res)
);

router.get(
  "/download/:id",
  authMiddleware,
  (req, res) => controller.download(req as any, res)
);

// ⏸️ Rutas pendientes (comentadas para evitar error TS2339)
// router.get('/licitacion/:licitacionId', authMiddleware, (req, res) => controller.getByLicitacion(req as any, res));
// router.delete('/documento/:id', authMiddleware, (req, res) => controller.deleteDocumento(req as any, res));

export default router;