import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../application/register.use-case.js';
import { LoginUseCase } from '../application/login.use-case.js';
import { RefreshTokenUseCase } from '../application/refresh-token.use-case.js';
import { RequestPasswordResetUseCase } from '../application/request-password-reset.use-case.js';
import { ResetPasswordUseCase } from '../application/reset-password.use-case.js';
import { GetCurrentUserUseCase } from '../application/get-current-user.use-case.js';
import { UpdateProfileUseCase } from '../application/update-profile.use-case.js';
import { LogoutUseCase } from '../application/logout.use-case.js';
import { SupabaseAuthRepository } from '../infrastructure/supabase-auth.repository.js';
import { UnauthorizedError } from '../../../core/errors/app-error.js';

export class AuthController {
  private readonly authRepo = new SupabaseAuthRepository();
  private readonly registerUseCase = new RegisterUseCase(this.authRepo);
  private readonly loginUseCase = new LoginUseCase(this.authRepo);
  private readonly refreshTokenUseCase = new RefreshTokenUseCase(this.authRepo);
  private readonly requestResetUseCase = new RequestPasswordResetUseCase(this.authRepo);
  private readonly resetPasswordUseCase = new ResetPasswordUseCase(this.authRepo);
  private readonly getCurrentUserUseCase = new GetCurrentUserUseCase(this.authRepo);
  private readonly updateProfileUseCase = new UpdateProfileUseCase(this.authRepo);
  private readonly logoutUseCase = new LogoutUseCase(this.authRepo);

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = await this.registerUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        token: session.token,
        refreshToken: session.refreshToken,
        user: session.user,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const session = await this.loginUseCase.execute({
        ...req.body,
        ipAddress,
      });

      res.status(200).json({
        success: true,
        token: session.token,
        refreshToken: session.refreshToken,
        user: session.user,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = await this.refreshTokenUseCase.execute(req.body.refreshToken);
      res.status(200).json({
        success: true,
        token: session.token,
        refreshToken: session.refreshToken,
        user: session.user,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const result = await this.requestResetUseCase.execute(req.body.email, ipAddress);

      res.status(200).json({
        success: true,
        message: 'Si la dirección está registrada, hemos enviado las instrucciones de recuperación.',
        data: {
          expiraEn: result.expiraEn,
          ...(process.env['NODE_ENV'] !== 'production' ? { devResetToken: result.token } : {}),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.resetPasswordUseCase.execute(req.body);
      res.status(200).json({
        success: true,
        message: 'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión.',
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuario no identificado');
      }
      const profile = await this.getCurrentUserUseCase.execute(req.user.id);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuario no identificado');
      }
      const updatedProfile = await this.updateProfileUseCase.execute(req.user.id, req.body);
      res.status(200).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1] || '';
      await this.logoutUseCase.execute(token);
      res.status(200).json({
        success: true,
        message: 'Sesión finalizada exitosamente.',
      });
    } catch (error) {
      next(error);
    }
  };
}
