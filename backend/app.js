import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import templateRoutes from './routes/templateRoutes.js';
import { getMembers } from './controllers/filterAndSortController.js';
import memberRoutes from './routes/memberRoutes.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); 
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', templateRoutes);
app.use('/api/members', getMembers);
app.use('/api', memberRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);

export default app;
