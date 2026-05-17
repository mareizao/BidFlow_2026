import { LicitacionRepository } from '../../domain/repositories/LicitacionRepository';
import { TareaRepository } from '../../domain/repositories/TareaRepository';
import { DashboardResponseDTO } from '../dtos/BidDTOs';

export class GetDashboardUseCase {
  constructor(
    private licitacionRepository: LicitacionRepository,
    private tareaRepository: TareaRepository
  ) {}

  async execute(userId: string, userRol: string, userArea: string): Promise<DashboardResponseDTO> {
    // 1. Obtener todas las licitaciones del usuario
    const { licitaciones } = await this.licitacionRepository.findAll(
      { limit: 100 },
      userId,
      userRol,
      userArea
    );

    // 2. Calcular estadísticas
    const activas = licitaciones.filter((l) =>
      ['borrador', 'en_revision'].includes(l.estado)
    ).length;
    const completadas = licitaciones.filter((l) =>
      ['aprobada', 'cerrada'].includes(l.estado)
    ).length;

    // 3. Tareas pendientes del usuario
    const tareasPendientes = await this.tareaRepository.countPendientesByResponsable(userId);

    // 4. Licitaciones recientes (últimas 5)
    const licitacionesRecientes = licitaciones.slice(0, 5).map((lic) => {
      const tareas = lic.tareas || [];
      const completadasTareas = tareas.filter((t) => t.estado === 'completada').length;
      const avance = tareas.length > 0
        ? Math.round((completadasTareas / tareas.length) * 100)
        : 0;
      return {
        id: lic.id,
        titulo: lic.titulo,
        estado: lic.estado,
        avance,
      };
    });

    // 5. Tareas asignadas al usuario
    const tareasAsignadas = await this.tareaRepository.findByResponsableId(userId);
    const tareasDTO = await Promise.all(
      tareasAsignadas.slice(0, 10).map(async (tarea: any) => ({
        id: tarea.id,
        licitacionTitulo: tarea.licitacion?.titulo || 'Sin título',
        area: tarea.area,
        estado: tarea.estado,
      }))
    );

    return {
      userId,
      estadisticas: {
        totalLicitaciones: licitaciones.length,
        activas,
        completadas,
        tareasPendientes,
      },
      licitacionesRecientes,
      tareasAsignadas: tareasDTO,
    };
  }
}