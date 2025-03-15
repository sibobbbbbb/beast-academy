import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import templateRoutes from './routes/templateRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); 
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', templateRoutes);
app.use('/api', memberRoutes);
app.use('/api/auth', authRoutes);

export default app;
