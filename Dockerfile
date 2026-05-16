FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema necesarias para bcrypt
RUN apk add --no-cache python3 make g++

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Generar cliente Prisma
RUN npx prisma generate

# Copiar código fuente
COPY src ./src
COPY scripts ./scripts

# Compilar TypeScript
RUN npm run build

# Script de inicio que ejecuta migraciones y luego el servidor
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/docker-entrypoint.sh"]
