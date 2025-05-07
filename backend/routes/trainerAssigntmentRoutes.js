import { Router } from 'express';
import {assignTrainer, removeStudents, getStudents} from '../controllers/trainerAssignmentController.js'
import authMiddleware  from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';

const router = Router()

router.post("/trainer/assign", authMiddleware,checkRole(['admin']), assignTrainer);
router.post("/trainer/remove", authMiddleware,checkRole(['admin']), removeStudents);
router.get("/trainer/students/:trainerId", authMiddleware,checkRole(['admin']), getStudents);

export default router