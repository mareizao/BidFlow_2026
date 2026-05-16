export type Rol = 'admin' | 'pre_sales' | 'sme' | 'finanzas' | 'juridico';

export interface User {
  id: string;
  email: string;
  password: string;
  nombre: string;
  rol: Rol;
  area: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  area: string;
}

export function toPublicUser(user: User): UserPublic {
  return {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
    area: user.area,
  };
}
