import express from 'express';
import { addMemberControllers, getMemberControllers, getMemberByIdControllers ,deleteMemberControllers, updateMemberControllers } from '../controllers/memberController.js';

const router = express.Router();

router.post('/add-member', addMemberControllers);
router.get('/get-member', getMemberControllers);
router.get('/get-member/:id', getMemberByIdControllers);
router.delete('/delete-member/:id', deleteMemberControllers);
router.put('/update-member/:id', updateMemberControllers);

export default router;