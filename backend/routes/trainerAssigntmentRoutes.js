import { Router } from 'express';
import {assignTrainer, removeStudents, getStudents} from '../controllers/trainerAssignmentController.js'
import authMiddleware  from '../middlewares/authMiddleware.js';

const router = Router()

router.post("/assign", authMiddleware,checkRole(['admin']), assignTrainer);
router.post("/remove", authMiddleware,checkRole(['admin']), removeStudents);
router.get("/students/:trainerId", authMiddleware,checkRole(['admin']), getStudents);
