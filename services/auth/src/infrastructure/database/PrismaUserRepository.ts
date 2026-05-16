import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, Rol } from '../../domain/entities/User';
import prisma from './prismaClient';

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  private mapToDomain(prismaUser: {
    id: string;
    email: string;
    password: string;
    nombre: string;
    rol: string;
    area: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      nombre: prismaUser.nombre,
      rol: prismaUser.rol as Rol,
      area: prismaUser.area,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }
}
