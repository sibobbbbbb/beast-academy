import express from 'express';
import { addMemberControllers, getMemberControllers, getMemberByIdControllers ,deleteMemberControllers, updateMemberControllers, getProfileControllers, updateProfileControllers, checkPhoneNumberController } from '../controllers/memberController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.post('/add-member', addMemberControllers);
router.get('/get-member', getMemberControllers);
router.get('/get-member/:id', getMemberByIdControllers);
router.delete('/delete-member/:id', deleteMemberControllers);
router.put('/update-member/:id', updateMemberControllers);
router.get('/profile',authMiddleware ,getProfileControllers);
router.put('/update-profile',authMiddleware ,upload ,updateProfileControllers);
router.post('/check-phone',authMiddleware ,checkPhoneNumberController);

export default router;