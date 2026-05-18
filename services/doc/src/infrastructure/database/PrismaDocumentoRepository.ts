import { Documento } from '../../domain/entities/Documento';
import { DocumentoRepository } from '../../domain/repositories/DocumentoRepository';
import prisma from './prismaClient';

export class PrismaDocumentoRepository implements DocumentoRepository {
  async save(documento: Documento): Promise<Documento> {
    const saved = await prisma.documento.create({
      data: {
        id: documento.id,
        filename: documento.filename,
        storageKey: documento.storageKey,
        fileSize: documento.fileSize,
        mimeType: documento.mimeType,
        licitacionId: documento.licitacionId,
        uploadedBy: documento.uploadedBy,
        uploadedAt: documento.uploadedAt,
      },
    });

    return new Documento(
      saved.id,
      saved.filename,
      saved.storageKey,
      saved.fileSize,
      saved.mimeType,
      saved.licitacionId,
      saved.uploadedBy,
      saved.uploadedAt
    );
  }

  async findById(id: string): Promise<Documento | null> {
    const found = await prisma.documento.findUnique({ where: { id } });

    if (!found) return null;

    return new Documento(
      found.id,
      found.filename,
      found.storageKey,
      found.fileSize,
      found.mimeType,
      found.licitacionId,
      found.uploadedBy,
      found.uploadedAt
    );
  }

  async findByLicitacionId(licitacionId: string): Promise<Documento[]> {
    const docs = await prisma.documento.findMany({
      where: { licitacionId },
      orderBy: { uploadedAt: 'desc' },
    });

    return docs.map(
      (d: any) =>
        new Documento(
          d.id,
          d.filename,
          d.storageKey,
          d.fileSize,
          d.mimeType,
          d.licitacionId,
          d.uploadedBy,
          d.uploadedAt
        )
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.documento.delete({ where: { id } });
  }
}
