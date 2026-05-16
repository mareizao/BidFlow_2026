import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { DocController } from '../controllers/DocController';

const router = Router();
const controller = new DocController();

// POST /upload - Subir un archivo asociado a una licitación
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  (req, res) => controller.upload(req as any, res)
);

// GET /download/:id - Descargar un archivo por su ID
router.get(
  '/download/:id',
  authMiddleware,
  (req, res) => controller.download(req as any, res)
);

// GET /licitacion/:licitacionId - Listar todos los archivos de una licitación
router.get(
  '/licitacion/:licitacionId',
  authMiddleware,
  (req, res) => controller.getByLicitacion(req as any, res)
);

// DELETE /documento/:id - Eliminar un archivo (opcional)
router.delete(
  '/documento/:id',
  authMiddleware,
  (req, res) => controller.deleteDocumento(req as any, res)
);

export default router;
