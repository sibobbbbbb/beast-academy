import express from 'express';
import cors from 'cors';
import templateRoutes from './routes/templateRoutes.js';
import { getMembers } from './controllers/filterAndSortController.js';
import memberRoutes from './routes/memberRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', templateRoutes);
app.use('/members', getMembers);
app.use('/api', memberRoutes);

export default app;