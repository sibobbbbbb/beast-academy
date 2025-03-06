import express from 'express';
import cors from 'cors';
import templateRoutes from './routes/templateRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', templateRoutes);

export default app;