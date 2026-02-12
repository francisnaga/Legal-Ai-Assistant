/// <reference path="./types/express.d.ts" />
import express, { NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes';
import chatRoutes from './routes/chatRoutes';
import clientRoutes from './routes/clientRoutes';
import caseRoutes from './routes/caseRoutes';
import { requireAuth } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// import rateLimit from 'express-rate-limit';

/*
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  // @ts-ignore
  keyGenerator: (req) => req.auth?.userId || req.ip || '127.0.0.1', // Fallback to localhost if IP is weird
  standardHeaders: true,
  legacyHeaders: false,
});
*/

// app.use(limiter);

import type { Request, Response } from 'express';

// Routes
app.use('/api/upload', uploadRoutes); 
app.use('/api/chat', chatRoutes); 
app.use('/api/clients', clientRoutes);
app.use('/api/cases', caseRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Legal AI Assistant Backend is running');
});

// Example protected route
app.get('/api/protected', requireAuth, (req: Request, res: Response) => {
  // @ts-ignore
  res.json({ message: 'This is a protected route', auth: req.auth });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Handler]:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Hack to keep process alive
setInterval(() => {}, 1000);
