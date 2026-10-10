import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.CORS_ORIGINS }));
app.use(express.json());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url });
  next();
});

import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';

// Empty routers for now
const cartRouter = express.Router();
const wishlistRouter = express.Router();
const ordersRouter = express.Router();
const preferencesRouter = express.Router();
const assistantRouter = express.Router();
const documentsRouter = express.Router();
const aiLogsRouter = express.Router();

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/assistant', assistantRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/aiLogs', aiLogsRouter);

import { query } from './config/db.js';

app.get('/api/health', async (req, res, next) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', db: 'ok' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Health check failed', details: [] });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', details: [] });
});

app.use(errorHandler);

export default app;
