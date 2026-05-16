import { DocumentoRepository } from '../../domain/repositories/DocumentoRepository';
import { FileStorage } from '../../infrastructure/storage/FileStorage';

export class DeleteDocumentUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository,
    private readonly fileStorage: FileStorage
  ) {}

  async execute(id: string): Promise<void> {
    const documento = await this.documentoRepository.findById(id);

    if (!documento) {
      throw new Error('Documento no encontrado');
    }

    await this.fileStorage.delete(documento.licitacionId, documento.storageKey);
    await this.documentoRepository.delete(id);
  }
}
