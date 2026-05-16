import { DocumentoRepository } from '../../domain/repositories/DocumentoRepository';
import { LicitacionDocumentosResponseDTO } from '../dtos/DocumentoDTOs';

export class GetDocumentsByLicitacionUseCase {
  constructor(private readonly documentoRepository: DocumentoRepository) {}

  async execute(licitacionId: string): Promise<LicitacionDocumentosResponseDTO> {
    const documentos = await this.documentoRepository.findByLicitacionId(licitacionId);

    return {
      licitacionId,
      documentos: documentos.map((doc) => ({
        id: doc.id,
        filename: doc.filename,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        uploadedBy: doc.uploadedBy,
        uploadedAt: doc.uploadedAt.toISOString(),
      })),
      total: documentos.length,
    };
  }
}
