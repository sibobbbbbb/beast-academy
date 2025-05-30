import { Router } from 'express';
import { getStats, getTrainerStats } from "../controllers/statsController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';

const router = Router();
router.get('/admin-stats',authMiddleware,checkRole(['admin']), getStats);
router.get('/trainer-stats/:trainerId',authMiddleware,checkRole(['admin','trainer']), getTrainerStats);
export default router;