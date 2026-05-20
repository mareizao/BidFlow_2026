// services/bid/src/application/useCases/GetLicitacionesUseCase.ts
import { LicitacionRepository } from '../../domain/repositories/LicitacionRepository';
import { GetLicitacionesDTO, LicitacionResponseDTO } from '../dtos/BidDTOs';

export class GetLicitacionesUseCase {
  constructor(private licitacionRepository: LicitacionRepository) {}

  async execute(
    filters: GetLicitacionesDTO,
    visibility: { userId: string; userRol: string; userArea: string }
  ): Promise<{ licitaciones: LicitacionResponseDTO[]; total: number; page: number; limit: number }> {
    
    // ✅ El repositorio ya maneja la visibilidad por rol en findAll()
    const { licitaciones, total } = await this.licitacionRepository.findAll(
      filters,
      visibility
    );

    // Calcular porcentaje de avance para cada licitación
    const licitacionesConAvance = licitaciones.map((lic) => {
      const tareas = lic.tareas || [];
      const completadas = tareas.filter((t) => t.estado === 'completada').length;
      const porcentajeAvance = tareas.length > 0
        ? Math.round((completadas / tareas.length) * 100)
        : 0;

      return {
        ...lic,
        porcentajeAvance,
      };
    });

    return {
      licitaciones: licitacionesConAvance,
      total,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }
}