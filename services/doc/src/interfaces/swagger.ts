import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BidFlow - Doc Service API',
      version: '1.0.0',
      description: 'Microservicio de gestión documental para BidFlow',
    },
    servers: [
      { url: 'http://localhost:3003', description: 'Desarrollo local' },
      { url: 'https://bidflow-doc-svc.onrender.com', description: 'Producción' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        DocumentoResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            filename: { type: 'string', example: 'pliego_tecnico.pdf' },
            storageKey: { type: 'string', example: 'uuid.pdf' },
            fileSize: { type: 'number', example: 2457600 },
            mimeType: { type: 'string', example: 'application/pdf' },
            licitacionId: { type: 'string' },
            uploadedBy: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
            downloadUrl: { type: 'string', example: '/download/uuid' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/health': {
        get: {
          tags: ['Sistema'],
          summary: 'Health check',
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
                      service: { type: 'string', example: 'doc-svc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/upload': {
        post: {
          tags: ['Documentos'],
          summary: 'Subir documento',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['file', 'licitacionId'],
                  properties: {
                    file: { type: 'string', format: 'binary' },
                    licitacionId: { type: 'string', example: 'uuid-licitacion' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Documento subido',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/DocumentoResponse' } } },
            },
            400: { description: 'Error de validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/download/{id}': {
        get: {
          tags: ['Documentos'],
          summary: 'Descargar documento',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Archivo binario', content: { 'application/octet-stream': {} } },
            404: { description: 'No encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/licitacion/{licitacionId}': {
        get: {
          tags: ['Documentos'],
          summary: 'Listar documentos de una licitación',
          parameters: [{ in: 'path', name: 'licitacionId', required: true, schema: { type: 'string' } }],
          responses: {
            200: {
              description: 'Lista de documentos',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      licitacionId: { type: 'string' },
                      documentos: { type: 'array', items: { $ref: '#/components/schemas/DocumentoResponse' } },
                      total: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/documento/{id}': {
        delete: {
          tags: ['Documentos'],
          summary: 'Eliminar documento',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Eliminado' },
            404: { description: 'No encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);