import { TareaRepository } from "../../domain/repositories/TareaRepository";
import { LicitacionRepository } from "../../domain/repositories/LicitacionRepository";
import { Tarea } from "../../domain/entities/Tarea";

export class CompletarTareaUseCase {
  constructor(
    private tareaRepository: TareaRepository,
    private licitacionRepository: LicitacionRepository,
  ) {}

  async execute(
    tareaId: string,
    userId: string,
  ): Promise<{
    tarea: Tarea;
    licitacionActualizada: { estado: string; porcentajeAvance: number };
  }> {
    const tarea = await this.tareaRepository.findById(tareaId);
    if (!tarea) throw new Error("Tarea no encontrada");

    if (tarea.responsableId !== userId) {
      throw new Error("No tienes permiso para completar esta tarea");
    }

    const tareaActualizada = await this.tareaRepository.update(tareaId, {
      estado: "completada",
      completadaAt: new Date(),
    });

    // Traer todas las tareas y reemplazar la actualizada con el objeto en memoria
    const todasTareas = await this.tareaRepository.findByLicitacionId(
      tarea.licitacionId,
    );

    const tareasConEstadoReal = todasTareas.map((t) =>
      t.id === tareaId ? tareaActualizada : t,
    );

    const completadas = tareasConEstadoReal.filter(
      (t) => t.estado === "completada",
    ).length;

    const todasCompletadas = completadas === tareasConEstadoReal.length;
    const porcentajeAvance = Math.round(
      (completadas / tareasConEstadoReal.length) * 100,
    );

    const nuevoEstado = todasCompletadas ? "aprobada" : "en_revision";

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
