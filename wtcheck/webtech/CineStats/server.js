import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { initDb } from './src/db/lowdb.js';

import moviesRouter from './src/routes/movies.js';
import contactRouter from './src/routes/contact.js';
import authRouter from './src/routes/auth.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security and basics
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize DB
await initDb();

// Static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/movies', moviesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/login', authRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404 for API
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Fallback to SPA-like static pages if needed
app.get('*', (req, res) => {
  const candidate = path.join(__dirname, 'public', req.path);
  if (candidate.endsWith('.html')) {
    return res.sendFile(candidate);
  }
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`CineStats server running on port ${PORT}`);
});


