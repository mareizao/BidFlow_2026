import { v4 as uuidv4 } from 'uuid';
import { Documento } from '../../domain/entities/Documento';
import { DocumentoRepository } from '../../domain/repositories/DocumentoRepository';
import { UploadDocumentDTO, DocumentoResponseDTO } from '../dtos/DocumentoDTOs';

export class UploadDocumentUseCase {
  constructor(private readonly documentoRepository: DocumentoRepository) {}

  async execute(dto: UploadDocumentDTO): Promise<DocumentoResponseDTO> {
    const documento = new Documento(
      uuidv4(),
      dto.filename,
      dto.storageKey,
      dto.fileSize,
      dto.mimeType,
      dto.licitacionId,
      dto.uploadedBy,
      new Date()
    );

    const saved = await this.documentoRepository.save(documento);

    return {
      id: saved.id,
      filename: saved.filename,
      storageKey: saved.storageKey,
      fileSize: saved.fileSize,
      mimeType: saved.mimeType,
      licitacionId: saved.licitacionId,
      uploadedBy: saved.uploadedBy,
      uploadedAt: saved.uploadedAt.toISOString(),
      downloadUrl: `/download/${saved.id}`,
    };
  }
}
