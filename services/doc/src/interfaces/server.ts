import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import docRoutes from './routes/doc.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'doc-svc', port: PORT });
});

app.use('/', docRoutes);

app.listen(PORT, () => {
  console.log(`✅ doc-svc corriendo en puerto ${PORT}`);
});
