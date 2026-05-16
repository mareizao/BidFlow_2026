import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { UploadDocumentUseCase } from '../../application/useCases/UploadDocumentUseCase';
import { DownloadDocumentUseCase } from '../../application/useCases/DownloadDocumentUseCase';
import { GetDocumentsByLicitacionUseCase } from '../../application/useCases/GetDocumentsByLicitacionUseCase';
import { DeleteDocumentUseCase } from '../../application/useCases/DeleteDocumentUseCase';
import { PrismaDocumentoRepository } from '../../infrastructure/database/PrismaDocumentoRepository';
import { LocalFileStorage } from '../../infrastructure/storage/LocalFileStorage';

const repository = new PrismaDocumentoRepository();
const fileStorage = new LocalFileStorage();

const uploadUseCase = new UploadDocumentUseCase(repository);
const downloadUseCase = new DownloadDocumentUseCase(repository, fileStorage);
const getByLicitacionUseCase = new GetDocumentsByLicitacionUseCase(repository);
const deleteUseCase = new DeleteDocumentUseCase(repository, fileStorage);

export class DocController {
  async upload(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No se recibió ningún archivo' });
        return;
      }

      const { licitacionId, storageKey } = req.body;

      if (!licitacionId) {
        res.status(400).json({ error: 'licitacionId es requerido' });
        return;
      }

      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(licitacionId)) {
        res.status(400).json({ error: 'licitacionId debe ser un UUID válido' });
        return;
      }

      const result = await uploadUseCase.execute({
        filename: file.originalname,
        storageKey: storageKey || file.filename,
        fileSize: file.size,
        mimeType: file.mimetype,
        licitacionId,
        uploadedBy: req.user!.id,
      });

      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Archivo demasiado grande. Máximo 50MB') {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async download(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { documento, stream } = await downloadUseCase.execute(id);

      res.setHeader('Content-Type', documento.mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(documento.filename)}"`
      );
      res.setHeader('Content-Length', documento.fileSize);

      stream.pipe(res);
    } catch (error: any) {
      if (error.message === 'Documento no encontrado') {
        res.status(404).json({ error: 'Documento no encontrado' });
        return;
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getByLicitacion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { licitacionId } = req.params;
      const result = await getByLicitacionUseCase.execute(licitacionId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async deleteDocumento(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await deleteUseCase.execute(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Documento no encontrado') {
        res.status(404).json({ error: 'Documento no encontrado' });
        return;
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}
