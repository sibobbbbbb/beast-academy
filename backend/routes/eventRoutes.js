import express from 'express';
import { createEventController, readEventController, deleteEventContorller, updateEventController, readEventControllerId, likeEventController, unlikeEventController, readLikedEventControllerId } from '../controllers/eventController.js';
import { upload } from '../middlewares/multerMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';

const router = express.Router();

router.post('/events',authMiddleware, checkRole(['admin']), upload, createEventController);
router.get('/events', readEventController)
router.delete('/events/:id', authMiddleware, checkRole(['admin']), deleteEventContorller)
router.put('/events/:id', authMiddleware, checkRole(['admin']), upload, updateEventController);
router.get('/eventDetails/:id', readEventControllerId);
router.post('/likeEvent', authMiddleware, likeEventController);
router.post('/unlikeEvent', authMiddleware, unlikeEventController);
router.get('/likedEvents/:userId', authMiddleware, readLikedEventControllerId);

export default router;