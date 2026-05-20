// services/bid/src/application/useCases/CreateLicitacionUseCase.ts
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

    // ✅ Helper: Mapea input del frontend → Enum AreaTarea de Prisma
    const normalizarArea = (input: string): AreaTarea => {
      const lower = input.toLowerCase();
      if (lower === 'sme') return 'SME' as AreaTarea; // Prisma espera "SME"
      return lower as AreaTarea; // "finanzas" y "juridico" coinciden tal cual
    };

    // 1) Resolver responsables por ROL (siempre en minúscula para auth-svc)
    const responsablesPromise = Promise.all(
      dto.areas.map(async (areaInput) => {
        const rolBusqueda = areaInput.toLowerCase(); // "sme", "finanzas", "juridico"
        try {
          const usuarios = await this.authClient.getUsersByRol(rolBusqueda);
          return usuarios?.length > 0 ? usuarios[0].id : userId;
        } catch {
          return userId;
        }
      })
    );

    // 2) Crear tareas con el ÁREA normalizada al Enum
    let tareas: any[];
    try {
      const [responsables] = await Promise.all([responsablesPromise]);

      tareas = await Promise.all(
        dto.areas.map((areaInput, i) =>
          this.tareaRepository.save({
            licitacionId: licitacion.id,
            area: normalizarArea(areaInput), // ✅ 'SME', 'finanzas' o 'juridico'
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