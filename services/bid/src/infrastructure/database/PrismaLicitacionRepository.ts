import prisma from './prismaClient';
import { LicitacionRepository, LicitacionFilters } from '../../src/domain/repositories/LicitacionRepository';
import { Licitacion } from '../../src/domain/entities/Licitacion';

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
    userId: string,
    userRol: string,
    userArea: string
  ): Promise<{ licitaciones: Licitacion[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    // Filtro base por estado
    const where: any = {};
    if (filters.estado) {
      where.estado = filters.estado;
    }

    // Filtrado por rol/área
    const rolesGlobales = ['admin', 'pre_sales'];
    if (!rolesGlobales.includes(userRol)) {
      where.tareas = {
        some: {
          responsableId: userId,
          area: userArea,
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