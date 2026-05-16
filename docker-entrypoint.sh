#!/bin/sh
set -e

echo "⏳ Esperando a que PostgreSQL esté listo..."
until npx prisma db push --skip-generate 2>/dev/null; do
  echo "   PostgreSQL aún no está listo, reintentando en 3s..."
  sleep 3
done

echo "✅ Base de datos lista"

echo "🌱 Ejecutando seed..."
npm run prisma:seed || echo "⚠️  Seed ya ejecutado o falló, continuando..."

echo "🚀 Iniciando Auth Service..."
npm run start
