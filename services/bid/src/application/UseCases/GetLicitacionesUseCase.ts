import { LicitacionRepository } from '../../src/domain/repositories/LicitacionRepository';
import { GetLicitacionesDTO, LicitacionResponseDTO } from '../dtos/BidDTOs';

export class GetLicitacionesUseCase {
  constructor(private licitacionRepository: LicitacionRepository) {}

  async execute(
    filters: GetLicitacionesDTO,
    userId: string,
    userRol: string,
    userArea: string
  ): Promise<{ licitaciones: LicitacionResponseDTO[]; total: number; page: number; limit: number }> {
    const { licitaciones, total } = await this.licitacionRepository.findAll(
      filters,
      userId,
      userRol,
      userArea
    );

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