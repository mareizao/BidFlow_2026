import prisma from './prismaClient';
import { TareaRepository } from '../../domain/repositories/TareaRepository';
import { Tarea } from '../../domain/entities/Tarea';

export class PrismaTareaRepository implements TareaRepository {
  async save(tarea: Omit<Tarea, 'id' | 'createdAt'>): Promise<Tarea> {
    const created = await prisma.tarea.create({
      data: {
        licitacionId: tarea.licitacionId,
        area: tarea.area,
        responsableId: tarea.responsableId,
        estado: tarea.estado,
        horasEstimadas: tarea.horasEstimadas,
        completadaAt: tarea.completadaAt,
      },
    });
    return created as Tarea;
  }

  async findById(id: string): Promise<Tarea | null> {
    const tarea = await prisma.tarea.findUnique({ where: { id } });
    return tarea as Tarea | null;
  }

  async findByLicitacionId(licitacionId: string): Promise<Tarea[]> {
    const tareas = await prisma.tarea.findMany({
      where: { licitacionId },
    });
    return tareas as Tarea[];
  }

  async findByResponsableId(responsableId: string): Promise<Tarea[]> {
    const tareas = await prisma.tarea.findMany({
      where: { responsableId },
      include: { licitacion: true },
    });
    return tareas as Tarea[];
  }

  async update(id: string, data: Partial<Tarea>): Promise<Tarea> {
    const updated = await prisma.tarea.update({
      where: { id },
      data: {
        ...(data.estado && { estado: data.estado }),
        ...(data.horasEstimadas !== undefined && { horasEstimadas: data.horasEstimadas }),
        ...(data.completadaAt !== undefined && { completadaAt: data.completadaAt }),
        ...(data.responsableId && { responsableId: data.responsableId }),
      },
    });
    return updated as Tarea;
  }

  async countPendientesByResponsable(responsableId: string): Promise<number> {
    return prisma.tarea.count({
      where: {
        responsableId,
        estado: 'pendiente',
      },
    });
  }
}