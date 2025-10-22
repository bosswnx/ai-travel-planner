import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import planRoutes from './routes/planRoutes.js';
import { config } from './config.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', planRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});
