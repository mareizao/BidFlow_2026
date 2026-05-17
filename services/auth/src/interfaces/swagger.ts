import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BidFlow - Auth Service API',
      version: '1.0.0',
      description: 'Microservicio de autenticación y autorización para BidFlow',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Desarrollo local' },
      { url: 'https://bidflow-auth-svc.onrender.com', description: 'Producción' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'presales@bidflow.com' },
            password: { type: 'string', example: 'presales123' },
          },
        },
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-123' },
            email: { type: 'string', example: 'presales@bidflow.com' },
            nombre: { type: 'string', example: 'Carlos López' },
            rol: {
              type: 'string',
              enum: ['admin', 'pre_sales', 'sme', 'finanzas', 'juridico'],
            },
            area: { type: 'string', example: 'pre-sales' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            user: { $ref: '#/components/schemas/UserPublic' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Credenciales inválidas' },
          },
        },
      },
    },
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
                      service: { type: 'string', example: 'auth-service' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login exitoso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginResponse' },
                },
              },
            },
            400: {
              description: 'Campos requeridos faltantes',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            401: {
              description: 'Credenciales inválidas',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/verify': {
        get: {
          tags: ['Autenticación'],
          summary: 'Verificar token JWT',
          description: 'Valida el token y retorna los datos del usuario. Usado por bid-svc y doc-svc.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Token válido',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UserPublic' },
                },
              },
            },
            401: {
              description: 'Token inválido o expirado',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);