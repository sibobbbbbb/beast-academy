import express from 'express';
import { createEventController, readEventController, deleteEventContorller, updateEventController, readEventControllerId } from '../controllers/eventController.js';

const router = express.Router();

router.post('/events', createEventController)
router.get('/events', readEventController)
router.delete('/events/:id', deleteEventContorller)
router.put('/events/:id', updateEventController)
router.get('/eventDetails/:id', readEventControllerId);

export default router;