import express from 'express';
import * as passwordController from '../controllers/passwordController.js';

const router = express.Router();

router.post('/recuperar-senha', passwordController.requestPasswordReset);
router.post('/resetar-senha', passwordController.resetPassword);
router.get('/verificar-token', passwordController.verifyResetToken);

export default router;
