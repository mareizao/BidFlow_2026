import { Documento } from '../entities/Documento';

export interface DocumentoRepository {
  save(documento: Documento): Promise<Documento>;
  findById(id: string): Promise<Documento | null>;
  findByLicitacionId(licitacionId: string): Promise<Documento[]>;
  delete(id: string): Promise<void>;
}
