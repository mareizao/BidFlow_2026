import { TareaRepository } from '../../src/domain/repositories/TareaRepository';
import { LicitacionRepository } from '../../src/domain/repositories/LicitacionRepository';
import { Tarea } from '../../src/domain/entities/Tarea';

export class CompletarTareaUseCase {
  constructor(
    private tareaRepository: TareaRepository,
    private licitacionRepository: LicitacionRepository
  ) {}

  async execute(tareaId: string, userId: string): Promise<{
    tarea: Tarea;
    licitacionActualizada: { estado: string; porcentajeAvance: number };
  }> {
    // 1. Buscar la tarea
    const tarea = await this.tareaRepository.findById(tareaId);
    if (!tarea) throw new Error('Tarea no encontrada');

    // 2. Validar que el usuario es el responsable
    if (tarea.responsableId !== userId) {
      throw new Error('No tienes permiso para completar esta tarea');
    }

    // 3. Completar la tarea
    const tareaActualizada = await this.tareaRepository.update(tareaId, {
      estado: 'completada',
      completadaAt: new Date(),
    });

    // 4. Verificar si todas las tareas están completas
    const todasTareas = await this.tareaRepository.findByLicitacionId(tarea.licitacionId);
    const todasCompletadas = todasTareas.every((t) =>
      t.id === tareaId ? true : t.estado === 'completada'
    );

    const completadas = todasTareas.filter((t) =>
      t.id === tareaId ? true : t.estado === 'completada'
    ).length;
    const porcentajeAvance = Math.round((completadas / todasTareas.length) * 100);

    // 5. Actualizar estado de licitación si corresponde
    const nuevoEstado = todasCompletadas ? 'aprobada' : 'en_revision';
    await this.licitacionRepository.update(tarea.licitacionId, {
      estado: nuevoEstado,
    });

    return {
      tarea: tareaActualizada,
      licitacionActualizada: {
        estado: nuevoEstado,
        porcentajeAvance,
      },
    };
  }
}