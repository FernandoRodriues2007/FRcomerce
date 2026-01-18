import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', authenticateToken, authController.me);
router.put('/perfil', authenticateToken, authController.updateProfile);

export default router;
