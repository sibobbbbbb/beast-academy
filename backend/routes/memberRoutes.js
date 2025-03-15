import express from 'express';
import { addMemberControllers } from '../controllers/memberController.js';

const router = express.Router();

router.post('/add-member', addMemberControllers);

export default router;