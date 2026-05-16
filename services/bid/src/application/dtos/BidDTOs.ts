import { AreaTarea } from '../../src/domain/entities/Tarea';

// Request DTOs
export interface CreateLicitacionDTO {
  titulo: string;
  cliente: string;
  fechaCierre: string;
  areas: AreaTarea[];
}

export interface GetLicitacionesDTO {
  estado?: string;
  page?: number;
  limit?: number;
}

export interface CompletarTareaDTO {
  tareaId: string;
  userId: string;
}

// Response DTOs
export interface TareaResponseDTO {
  id: string;
  area: string;
  responsableId: string;
  estado: string;
  horasEstimadas: number;
  completadaAt: Date | null;
}

export interface LicitacionResponseDTO {
  id: string;
  titulo: string;
  cliente: string;
  estado: string;
  fechaCierre: Date;
  createdBy: string;
  createdAt: Date;
  tareas?: TareaResponseDTO[];
  porcentajeAvance?: number;
}

export interface DashboardResponseDTO {
  userId: string;
  estadisticas: {
    totalLicitaciones: number;
    activas: number;
    completadas: number;
    tareasPendientes: number;
  };
  licitacionesRecientes: {
    id: string;
    titulo: string;
    estado: string;
    avance: number;
  }[];
  tareasAsignadas: {
    id: string;
    licitacionTitulo: string;
    area: string;
    estado: string;
  }[];
}