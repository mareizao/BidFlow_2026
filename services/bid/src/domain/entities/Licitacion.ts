import { Tarea } from './Tarea';

export type EstadoLicitacion = 'borrador' | 'en_revision' | 'aprobada' | 'cerrada';

export interface Licitacion {
  id: string;
  titulo: string;
  cliente: string;
  estado: EstadoLicitacion;
  fechaCierre: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tareas?: Tarea[];
}