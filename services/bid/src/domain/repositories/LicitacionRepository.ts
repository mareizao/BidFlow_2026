import { Licitacion } from '../entities/Licitacion';

export interface LicitacionFilters {
  estado?: string;
  page?: number;
  limit?: number;
}

export interface LicitacionRepository {
  save(licitacion: Omit<Licitacion, 'id' | 'createdAt' | 'updatedAt' | 'tareas'>): Promise<Licitacion>;
  findById(id: string): Promise<Licitacion | null>;
  findAll(
    filters: LicitacionFilters,
    userId: string,
    userRol: string,
    userArea: string
  ): Promise<{ licitaciones: Licitacion[]; total: number }>;
  update(id: string, data: Partial<Licitacion>): Promise<Licitacion>;
  delete(id: string): Promise<void>;
}