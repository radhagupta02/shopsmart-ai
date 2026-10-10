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
import documentsRouter from './routes/documents.js';

import cartRouter from './routes/cart.js';
import wishlistRouter from './routes/wishlist.js';
import ordersRouter from './routes/orders.js';
import preferencesRouter from './routes/preferences.js';
import assistantRouter from './routes/assistant.js';
import aiLogsRouter from './routes/aiLogs.js';

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', preferencesRouter);
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
