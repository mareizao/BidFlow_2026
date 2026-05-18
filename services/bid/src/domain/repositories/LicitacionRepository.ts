import { Licitacion, EstadoLicitacion } from '../entities/Licitacion';
import { Tarea } from '../entities/Tarea';

export interface LicitacionFilters {
  estado?: string;
  page?: number;
  limit?: number;
}

// Los campos que realmente pueden cambiar después de crear una licitación
export interface LicitacionUpdatableFields {
  titulo?: string;
  cliente?: string;
  estado?: EstadoLicitacion;
  fechaCierre?: Date;
}

// El contexto de visibilidad se encapsula aparte, no contamina los filtros
export interface VisibilityContext {
  userId: string;
  userRol: string;
  userArea: string;
}

export interface LicitacionRepository {
  save(
    licitacion: Omit<Licitacion, 'id' | 'createdAt' | 'updatedAt' | 'tareas'>
  ): Promise<Licitacion>;

  saveWithTareas(
    licitacion: Omit<Licitacion, 'id' | 'createdAt' | 'updatedAt' | 'tareas'>,
    tareas: Omit<Tarea, 'id' | 'createdAt'>[]
  ): Promise<Licitacion & { tareas: Tarea[] }>;

  findById(id: string): Promise<Licitacion | null>;

  findAll(
    filters: LicitacionFilters,
    visibility: VisibilityContext
  ): Promise<{ licitaciones: Licitacion[]; total: number }>;

  update(id: string, data: LicitacionUpdatableFields): Promise<Licitacion>;

  delete(id: string): Promise<void>;
}