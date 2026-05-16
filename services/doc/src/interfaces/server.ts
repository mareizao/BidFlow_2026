import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'doc-svc', port: PORT });
});

app.listen(PORT, () => {
  console.log(`✅ doc-svc corriendo en puerto ${PORT}`);
});
```

### `services/doc/uploads/.gitkeep`
```