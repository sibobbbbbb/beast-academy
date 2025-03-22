import express from 'express';
import { register, login, logout, getProfile, googleLogin, facebookLogin, googleCallback} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getProfile);
// Social login routes
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.post('/google/callback', googleCallback);

export default router;
