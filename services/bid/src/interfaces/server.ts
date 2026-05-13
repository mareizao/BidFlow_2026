import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bidRoutes from './routes/bid.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'bid-svc', port: PORT });
});

// Rutas
app.use('/', bidRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ bid-svc corriendo en puerto ${PORT}`);
});

export default app;