import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import bidRoutes from './routes/bid.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'bid-svc', port: PORT });
});

// Rutas
app.use('/', bidRoutes);

app.listen(PORT, () => {
  console.log(`✅ bid-svc corriendo en puerto ${PORT}`);
  console.log(`📚 Documentación: http://localhost:${PORT}/docs`);
});

export default app;