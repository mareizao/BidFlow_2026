export type AreaTarea = 'SME' | 'finanzas' | 'juridico';
export type EstadoTarea = 'pendiente' | 'completada';

export interface Tarea {
  id: string;
  licitacionId: string;
  area: AreaTarea;
  responsableId: string;
  estado: EstadoTarea;
  horasEstimadas: number;
  completadaAt: Date | null;
  createdAt: Date;
}