import { LicitacionRepository } from '../../domain/repositories/LicitacionRepository';
import { LicitacionResponseDTO } from '../dtos/BidDTOs';

export class GetLicitacionByIdUseCase {
  constructor(private licitacionRepository: LicitacionRepository) {}

  async execute(id: string): Promise<LicitacionResponseDTO | null> {
    const licitacion = await this.licitacionRepository.findById(id);
    if (!licitacion) return null;

    const tareas = licitacion.tareas || [];
    const completadas = tareas.filter((t) => t.estado === 'completada').length;
    const porcentajeAvance = tareas.length > 0
      ? Math.round((completadas / tareas.length) * 100)
      : 0;

    return {
      ...licitacion,
      porcentajeAvance,
    };
  }
}