import { Readable } from 'stream';
import { DocumentoRepository } from '../../domain/repositories/DocumentoRepository';
import { FileStorage } from '../../infrastructure/storage/FileStorage';
import { Documento } from '../../domain/entities/Documento';

export interface DownloadResult {
  documento: Documento;
  stream: Readable;
}

export class DownloadDocumentUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository,
    private readonly fileStorage: FileStorage
  ) {}

  async execute(id: string): Promise<DownloadResult> {
    const documento = await this.documentoRepository.findById(id);

    if (!documento) {
      throw new Error('Documento no encontrado');
    }

    const stream = await this.fileStorage.getStream(documento.licitacionId, documento.storageKey);

    return { documento, stream };
  }
}
