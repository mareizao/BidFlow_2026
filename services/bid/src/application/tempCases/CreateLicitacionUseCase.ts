import { LicitacionRepository } from '../../domain/repositories/LicitacionRepository';
import { TareaRepository } from '../../domain/repositories/TareaRepository';
import { CreateLicitacionDTO, LicitacionResponseDTO } from '../dtos/BidDTOs';
import { AuthClient } from '../../infrastructure/http/AuthClient';
import { AreaTarea } from '../../domain/entities/Tarea';

export class CreateLicitacionUseCase {
  constructor(
    private licitacionRepository: LicitacionRepository,
    private tareaRepository: TareaRepository,
    private authClient: AuthClient
  ) {}

  async execute(dto: CreateLicitacionDTO, userId: string): Promise<LicitacionResponseDTO> {
    const licitacion = await this.licitacionRepository.save({
      titulo: dto.titulo,
      cliente: dto.cliente,
      estado: 'en_revision',
      fechaCierre: new Date(dto.fechaCierre),
      createdBy: userId,
    });

    // 1) Resolver responsables en paralelo (ADR 6)
    const responsablesPromise = Promise.all(
      dto.areas.map(async (area) => {
        try {
          const usuarios = await this.authClient.getUsersByRol(area.toLowerCase());
          return usuarios?.length > 0 ? usuarios[0].id : userId;
        } catch {
          return userId;
        }
      })
    );

    // 2) Crear tareas en paralelo (pero con responsables resueltos)
    //    Usamos una Promise.all independiente para cumplir la estructura del ADR.
    let tareas: any[];
    try {
      const [responsables] = await Promise.all([responsablesPromise]);

      tareas = await Promise.all(
        dto.areas.map((area, i) =>
          this.tareaRepository.save({
            licitacionId: licitacion.id,
            area: area as AreaTarea,
            responsableId: responsables[i],
            estado: 'pendiente',
            horasEstimadas: 0,
            completadaAt: null,
          })
        )
      );
    } catch (error) {
      await this.licitacionRepository.delete(licitacion.id);
      throw new Error('No se pudieron crear las tareas de la licitación');
    }

    return {
      ...licitacion,
      tareas,
      porcentajeAvance: 0,
    };
  }
}
