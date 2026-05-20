// services/bid/src/infrastructure/database/PrismaLicitacionRepository.ts
import prisma from './prismaClient';
import { LicitacionRepository, LicitacionFilters, VisibilityContext } from '../../domain/repositories/LicitacionRepository';
import { Licitacion } from '../../domain/entities/Licitacion';
import { Tarea } from '../../domain/entities/Tarea';

export class PrismaLicitacionRepository implements LicitacionRepository {
  
  async save(licitacion: Omit<Licitacion, 'id' | 'createdAt' | 'updatedAt' | 'tareas'>): Promise<Licitacion> {
    const created = await prisma.licitacion.create({
      data: {
        titulo: licitacion.titulo,
        cliente: licitacion.cliente,
        estado: licitacion.estado,
        fechaCierre: licitacion.fechaCierre,
        createdBy: licitacion.createdBy,
      },
    });
    return created as Licitacion;
  }

  async findById(id: string): Promise<Licitacion | null> {
    const licitacion = await prisma.licitacion.findUnique({
      where: { id },
      include: { tareas: true },
    });
    return licitacion as Licitacion | null;
  }

  async findAll(
    filters: LicitacionFilters,
    visibility: VisibilityContext
  ): Promise<{ licitaciones: Licitacion[]; total: number }> {
    const { userId, userRol, userArea } = visibility;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    // Filtro base por estado
    const where: any = {};
    if (filters.estado) {
      where.estado = filters.estado;
    }

    // ✅ FILTRADO POR ROL: admin/pre_sales ven todo, otros solo sus tareas
    const rolesGlobales = ['admin', 'pre_sales'];
    if (!rolesGlobales.includes(userRol)) {
      where.tareas = {
        some: {
          responsableId: userId,
          // Opcional: filtrar también por área si es necesario
          // area: userArea,
        },
      };
    }

    const [licitaciones, total] = await Promise.all([
      prisma.licitacion.findMany({
        where,
        include: { tareas: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.licitacion.count({ where }),
    ]);

    return { licitaciones: licitaciones as Licitacion[], total };
  }

  async saveWithTareas(
    licitacion: Omit<Licitacion, 'id' | 'createdAt' | 'updatedAt' | 'tareas'>,
    tareas: Omit<Tarea, 'id' | 'createdAt'>[],
  ): Promise<Licitacion & { tareas: Tarea[] }> {
    return prisma.$transaction(async (tx) => {
      const created = await tx.licitacion.create({
        data: {
          titulo: licitacion.titulo,
          cliente: licitacion.cliente,
          estado: licitacion.estado,
          fechaCierre: licitacion.fechaCierre,
          createdBy: licitacion.createdBy,
        },
      });

      await tx.tarea.createMany({
        data: tareas.map((t) => ({
          licitacionId: created.id,
          area: t.area,
          responsableId: t.responsableId,
          estado: t.estado,
          horasEstimadas: t.horasEstimadas,
          completadaAt: t.completadaAt,
        })),
      });

      const tareasRecuperadas = await tx.tarea.findMany({
        where: { licitacionId: created.id },
      });

      return {
        ...(created as Licitacion),
        tareas: tareasRecuperadas as unknown as Tarea[],
      } as Licitacion & { tareas: Tarea[] };
    });
  }

  async update(id: string, data: Partial<Licitacion>): Promise<Licitacion> {
    const updated = await prisma.licitacion.update({
      where: { id },
      data: {
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.cliente && { cliente: data.cliente }),
        ...(data.estado && { estado: data.estado }),
        ...(data.fechaCierre && { fechaCierre: data.fechaCierre }),
      },
    });
    return updated as Licitacion;
  }

  async delete(id: string): Promise<void> {
    await prisma.licitacion.delete({ where: { id } });
  }
}