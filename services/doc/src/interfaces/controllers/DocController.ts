// services/doc/src/controllers/DocController.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DocController {
  async upload(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const file = req.file;
      const { licitacionId, filename, mimeType, fileSize, storageKey } = req.body;

      if (!file || !licitacionId || !storageKey) {
        res.status(400).json({ error: 'Archivo, licitacionId y metadatos son requeridos' });
        return;
      }

      // ✅ Prisma generará el id automáticamente gracias a @default(uuid())
      const docRecord = await prisma.documento.create({
        data: {
          id: crypto.randomUUID(),
          licitacionId,
          filename,
          storageKey,
          fileSize: Number(fileSize),
          mimeType,
          uploadedBy: req.user!.id,
          // ✅ NO incluir id: Prisma lo genera solo
        },
      });

      res.status(201).json({ success: true, data: docRecord });
    } catch (error: any) {
      console.error('[DocController.upload]', error);
      res.status(500).json({ error: error.message || 'Error interno al guardar documento' });
    }
  }
}