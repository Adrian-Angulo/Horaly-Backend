import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    private readonly authRepo;
    private readonly registerUseCase;
    private readonly loginUseCase;
    private readonly refreshTokenUseCase;
    private readonly requestResetUseCase;
    private readonly resetPasswordUseCase;
    private readonly getCurrentUserUseCase;
    private readonly updateProfileUseCase;
    private readonly logoutUseCase;
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
