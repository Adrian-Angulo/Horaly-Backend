"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const register_use_case_js_1 = require("../application/register.use-case.js");
const login_use_case_js_1 = require("../application/login.use-case.js");
const refresh_token_use_case_js_1 = require("../application/refresh-token.use-case.js");
const request_password_reset_use_case_js_1 = require("../application/request-password-reset.use-case.js");
const reset_password_use_case_js_1 = require("../application/reset-password.use-case.js");
const get_current_user_use_case_js_1 = require("../application/get-current-user.use-case.js");
const update_profile_use_case_js_1 = require("../application/update-profile.use-case.js");
const logout_use_case_js_1 = require("../application/logout.use-case.js");
const supabase_auth_repository_js_1 = require("../infrastructure/supabase-auth.repository.js");
const app_error_js_1 = require("../../../core/errors/app-error.js");
class AuthController {
    authRepo = new supabase_auth_repository_js_1.SupabaseAuthRepository();
    registerUseCase = new register_use_case_js_1.RegisterUseCase(this.authRepo);
    loginUseCase = new login_use_case_js_1.LoginUseCase(this.authRepo);
    refreshTokenUseCase = new refresh_token_use_case_js_1.RefreshTokenUseCase(this.authRepo);
    requestResetUseCase = new request_password_reset_use_case_js_1.RequestPasswordResetUseCase(this.authRepo);
    resetPasswordUseCase = new reset_password_use_case_js_1.ResetPasswordUseCase(this.authRepo);
    getCurrentUserUseCase = new get_current_user_use_case_js_1.GetCurrentUserUseCase(this.authRepo);
    updateProfileUseCase = new update_profile_use_case_js_1.UpdateProfileUseCase(this.authRepo);
    logoutUseCase = new logout_use_case_js_1.LogoutUseCase(this.authRepo);
    register = async (req, res, next) => {
        try {
            const session = await this.registerUseCase.execute(req.body);
            res.status(201).json({
                success: true,
                token: session.token,
                refreshToken: session.refreshToken,
                user: session.user,
                data: session,
            });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
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
        }
        catch (error) {
            next(error);
        }
    };
    refreshToken = async (req, res, next) => {
        try {
            const session = await this.refreshTokenUseCase.execute(req.body.refreshToken);
            res.status(200).json({
                success: true,
                token: session.token,
                refreshToken: session.refreshToken,
                user: session.user,
                data: session,
            });
        }
        catch (error) {
            next(error);
        }
    };
    forgotPassword = async (req, res, next) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const result = await this.requestResetUseCase.execute(req.body.email, ipAddress);
            res.status(200).json({
                success: true,
                message: 'Si la dirección está registrada, hemos enviado las instrucciones de recuperación.',
                data: {
                    expiraEn: result.expiraEn,
                    ...(process.env['NODE_ENV'] !== 'production' ? { devResetToken: result.token } : {}),
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            await this.resetPasswordUseCase.execute(req.body);
            res.status(200).json({
                success: true,
                message: 'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión.',
            });
        }
        catch (error) {
            next(error);
        }
    };
    getMe = async (req, res, next) => {
        try {
            if (!req.user?.id) {
                throw new app_error_js_1.UnauthorizedError('Usuario no identificado');
            }
            const profile = await this.getCurrentUserUseCase.execute(req.user.id);
            res.status(200).json(profile);
        }
        catch (error) {
            next(error);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            if (!req.user?.id) {
                throw new app_error_js_1.UnauthorizedError('Usuario no identificado');
            }
            const updatedProfile = await this.updateProfileUseCase.execute(req.user.id, req.body);
            res.status(200).json(updatedProfile);
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1] || '';
            await this.logoutUseCase.execute(token);
            res.status(200).json({
                success: true,
                message: 'Sesión finalizada exitosamente.',
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map