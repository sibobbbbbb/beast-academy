import { Router } from 'express';
import { getStats } from "../controllers/statsController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';

const router = Router();
router.get('/admin-stats',authMiddleware,checkRole(['admin']), getStats);

export default router;