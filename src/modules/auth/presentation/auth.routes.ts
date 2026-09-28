import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validateRequest } from '../../../core/middlewares/validation.middleware.js';
import { requireAuth } from '../../../core/middlewares/auth.middleware.js';
import {
  ForgotPasswordSchema,
  LoginSchema,
  RefreshTokenSchema,
  RegisterSchema,
  ResetPasswordSchema,
  UpdateProfileSchema,
} from '../infrastructure/dtos/auth.schemas.js';

const router = Router();
const controller = new AuthController();

// Rutas Públicas de Autenticación
router.post('/register', validateRequest(RegisterSchema), controller.register);
router.post('/login', validateRequest(LoginSchema), controller.login);
router.post('/refresh', validateRequest(RefreshTokenSchema), controller.refreshToken);
router.post('/forgot-password', validateRequest(ForgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validateRequest(ResetPasswordSchema), controller.resetPassword);

// Rutas Protegidas (Requieren Bearer Token de Supabase)
router.get('/me', requireAuth, controller.getMe);
router.put('/profile', requireAuth, validateRequest(UpdateProfileSchema), controller.updateProfile);
router.post('/logout', requireAuth, controller.logout);

export default router;
