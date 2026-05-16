import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BidFlow - Bid Service API',
      version: '1.0.0',
      description: 'Microservicio de gestión de licitaciones y tareas para BidFlow',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Desarrollo local',
      },
      {
        url: 'https://bidflow-bid-svc.onrender.com',
        description: 'Producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Licitacion: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-123' },
            titulo: { type: 'string', example: 'Propuesta Globant 2026' },
            cliente: { type: 'string', example: 'Globant' },
            estado: {
              type: 'string',
              enum: ['borrador', 'en_revision', 'aprobada', 'cerrada'],
              example: 'en_revision',
            },
            fechaCierre: { type: 'string', format: 'date-time' },
            createdBy: { type: 'string', example: 'user-uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            porcentajeAvance: { type: 'number', example: 45 },
          },
        },
        Tarea: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'task-uuid' },
            licitacionId: { type: 'string', example: 'lic-uuid' },
            area: {
              type: 'string',
              enum: ['SME', 'finanzas', 'juridico'],
              example: 'SME',
            },
            responsableId: { type: 'string', example: 'user-uuid' },
            estado: {
              type: 'string',
              enum: ['pendiente', 'completada'],
              example: 'pendiente',
            },
            horasEstimadas: { type: 'number', example: 5 },
            completadaAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        CreateLicitacionRequest: {
          type: 'object',
          required: ['titulo', 'cliente', 'fechaCierre', 'areas'],
          properties: {
            titulo: { type: 'string', example: 'Propuesta Globant 2026' },
            cliente: { type: 'string', example: 'Globant' },
            fechaCierre: { type: 'string', format: 'date-time', example: '2026-05-30T23:59:59Z' },
            areas: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['SME', 'finanzas', 'juridico'],
              },
              example: ['SME', 'finanzas', 'juridico'],
            },
          },
        },
        Dashboard: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            estadisticas: {
              type: 'object',
              properties: {
                totalLicitaciones: { type: 'number' },
                activas: { type: 'number' },
                completadas: { type: 'number' },
                tareasPendientes: { type: 'number' },
              },
            },
            licitacionesRecientes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  titulo: { type: 'string' },
                  estado: { type: 'string' },
                  avance: { type: 'number' },
                },
              },
            },
            tareasAsignadas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  licitacionTitulo: { type: 'string' },
                  area: { type: 'string' },
                  estado: { type: 'string' },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensaje de error' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/health': {
        get: {
          tags: ['Sistema'],
          summary: 'Health check del servicio',
          security: [],
          responses: {
            200: {
              description: 'Servicio funcionando',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      service: { type: 'string', example: 'bid-svc' },
                      port: { type: 'string', example: '3002' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/licitaciones': {
        get: {
          tags: ['Licitaciones'],
          summary: 'Listar licitaciones',
          description: 'Retorna licitaciones filtradas según el rol del usuario autenticado',
          parameters: [
            {
              in: 'query',
              name: 'estado',
              schema: {
                type: 'string',
                enum: ['borrador', 'en_revision', 'aprobada', 'cerrada'],
              },
              description: 'Filtrar por estado',
            },
            {
              in: 'query',
              name: 'page',
              schema: { type: 'integer', default: 1 },
              description: 'Número de página',
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer', default: 10 },
              description: 'Resultados por página',
            },
          ],
          responses: {
            200: {
              description: 'Lista de licitaciones',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      licitaciones: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Licitacion' },
                      },
                      total: { type: 'number' },
                      page: { type: 'number' },
                      limit: { type: 'number' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'No autenticado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Licitaciones'],
          summary: 'Crear licitación',
          description: 'Crea una nueva licitación con tareas automáticas por área. Solo admin y pre_sales.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateLicitacionRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Licitación creada',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Licitacion' },
                },
              },
            },
            400: {
              description: 'Datos inválidos',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            403: {
              description: 'Sin permisos',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/licitaciones/{id}': {
        get: {
          tags: ['Licitaciones'],
          summary: 'Obtener licitación por ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'ID de la licitación',
            },
          ],
          responses: {
            200: {
              description: 'Detalle de la licitación con tareas',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Licitacion' },
                },
              },
            },
            404: {
              description: 'Licitación no encontrada',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/tareas/{id}/completar': {
        put: {
          tags: ['Tareas'],
          summary: 'Completar tarea',
          description: 'Marca una tarea como completada. Solo el responsable asignado puede completarla.',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'ID de la tarea',
            },
          ],
          responses: {
            200: {
              description: 'Tarea completada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      tarea: { $ref: '#/components/schemas/Tarea' },
                      licitacionActualizada: {
                        type: 'object',
                        properties: {
                          estado: { type: 'string' },
                          porcentajeAvance: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
            403: {
              description: 'No eres el responsable de esta tarea',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            404: {
              description: 'Tarea no encontrada',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/dashboard/{userId}': {
        get: {
          tags: ['Dashboard'],
          summary: 'Obtener dashboard del usuario',
          description: 'Retorna estadísticas y resumen de licitaciones y tareas del usuario',
          parameters: [
            {
              in: 'path',
              name: 'userId',
              required: true,
              schema: { type: 'string' },
              description: 'ID del usuario',
            },
          ],
          responses: {
            200: {
              description: 'Dashboard del usuario',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Dashboard' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);