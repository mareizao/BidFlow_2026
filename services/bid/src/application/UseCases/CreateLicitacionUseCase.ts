import { LicitacionRepository } from '../../src/domain/repositories/LicitacionRepository';
import { TareaRepository } from '../../src/domain/repositories/TareaRepository';
import { CreateLicitacionDTO, LicitacionResponseDTO } from '../dtos/BidDTOs';
import { AuthClient } from '../../infrastructure/http/AuthClient';
import { AreaTarea } from '../../src/domain/entities/Tarea';

export class CreateLicitacionUseCase {
  constructor(
    private licitacionRepository: LicitacionRepository,
    private tareaRepository: TareaRepository,
    private authClient: AuthClient
  ) {}

  async execute(dto: CreateLicitacionDTO, userId: string): Promise<LicitacionResponseDTO> {
    // 1. Crear la licitación
    const licitacion = await this.licitacionRepository.save({
      titulo: dto.titulo,
      cliente: dto.cliente,
      estado: 'en_revision',
      fechaCierre: new Date(dto.fechaCierre),
      createdBy: userId,
    });

    // 2. Crear tareas automáticas por cada área
    const tareas = [];
    for (const area of dto.areas) {
      // Buscar responsable por área/rol
      let responsableId = userId; // fallback
      try {
        const usuarios = await this.authClient.getUsersByRol(area.toLowerCase());
        if (usuarios && usuarios.length > 0) {
          responsableId = usuarios[0].id;
        }
      } catch (error) {
        console.warn(`No se pudo obtener usuario para área ${area}, usando creador`);
      }

      const tarea = await this.tareaRepository.save({
        licitacionId: licitacion.id,
        area: area as AreaTarea,
        responsableId,
        estado: 'pendiente',
        horasEstimadas: 0,
        completadaAt: null,
      });
      tareas.push(tarea);
    }

    return {
      ...licitacion,
      tareas,
      porcentajeAvance: 0,
    };
  }
}