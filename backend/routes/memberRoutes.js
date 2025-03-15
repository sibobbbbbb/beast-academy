import express from 'express';
import { addMemberControllers, getMemberControllers, deleteMemberControllers, updateMemberControllers } from '../controllers/memberController.js';

const router = express.Router();

router.post('/add-member', addMemberControllers);
router.get('/get-member', getMemberControllers);
router.delete('/delete-member/:id', deleteMemberControllers);
router.put('/update-member/:id', updateMemberControllers);

export default router;

// import express from 'express'
// import { templateControllers, getUsers, deleteMemberControllers } from '../controllers/templateControllers.js'

// const router = express.Router()

// router.get('/template-routes', templateControllers)

// router.get('/get-users', getUsers)

// router.delete('/delete-member/:id', deleteMemberControllers)

// export default router
