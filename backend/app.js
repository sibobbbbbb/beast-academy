import express from 'express';
import cors from 'cors';
import templateRoutes from './routes/templateRoutes.js';
import { getMembers } from './controllers/filterAndSortController.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', templateRoutes);
app.use('/members', getMembers);

export default app;