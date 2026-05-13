import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import bidRoutes from './routes/bid.routes';
import logger from '../infrastructure/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Logging de requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
    });

    // Alerta si supera 2 segundos (ADR 003)
    if (duration > 2000) {
      logger.warn(`Respuesta lenta detectada: ${duration}ms en ${req.method} ${req.path}`);
    }
  });
  next();
});

// Documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'bid-svc', port: PORT });
});

// Rutas
app.use('/', bidRoutes);

// Error handler global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error no manejado', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  logger.info(`bid-svc corriendo en puerto ${PORT}`);
  logger.info(`Documentación disponible en http://localhost:${PORT}/docs`);
});

export default app;