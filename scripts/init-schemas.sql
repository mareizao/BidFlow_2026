CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS bid;
CREATE SCHEMA IF NOT EXISTS doc;

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const users = [
  {
    email: 'admin@bidflow.com',
    password: 'admin123',
    nombre: 'Admin BidFlow',
    rol: 'admin' as const,
    area: 'administracion',
  },
  {
    email: 'presales@bidflow.com',
    password: 'presales123',
    nombre: 'Carlos López',
    rol: 'pre_sales' as const,
    area: 'pre-sales',
  },
  {
    email: 'sme@bidflow.com',
    password: 'sme123',
    nombre: 'Ana Gómez',
    rol: 'sme' as const,
    area: 'SME',
  },
  {
    email: 'finanzas@bidflow.com',
    password: 'finanzas123',
    nombre: 'Luisa Fernández',
    rol: 'finanzas' as const,
    area: 'finanzas',
  },
  {
    email: 'juridico@bidflow.com',
    password: 'juridico123',
    nombre: 'Roberto Díaz',
    rol: 'juridico' as const,
    area: 'juridico',
  },
];

async function main() {
  console.log('🌱 Iniciando seed de usuarios...');

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: hashedPassword,
        nombre: user.nombre,
        rol: user.rol,
        area: user.area,
      },
      create: {
        email: user.email,
        password: hashedPassword,
        nombre: user.nombre,
        rol: user.rol,
        area: user.area,
      },
    });

    console.log(`   ✅ ${created.rol.padEnd(10)} — ${created.email}`);
  }

  console.log('\n Seed completado. Usuarios creados/actualizados.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
