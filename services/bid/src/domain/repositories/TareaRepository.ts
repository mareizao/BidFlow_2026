import { Tarea } from '../entities/Tarea';

export interface TareaRepository {
  save(tarea: Omit<Tarea, 'id' | 'createdAt'>): Promise<Tarea>;
  findById(id: string): Promise<Tarea | null>;
  findByLicitacionId(licitacionId: string): Promise<Tarea[]>;
  findByResponsableId(responsableId: string): Promise<Tarea[]>;
  update(id: string, data: Partial<Tarea>): Promise<Tarea>;
  countPendientesByResponsable(responsableId: string): Promise<number>;
}