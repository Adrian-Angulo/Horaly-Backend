"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const validation_middleware_js_1 = require("../../../core/middlewares/validation.middleware.js");
const auth_middleware_js_1 = require("../../../core/middlewares/auth.middleware.js");
const auth_schemas_js_1 = require("../infrastructure/dtos/auth.schemas.js");
const router = (0, express_1.Router)();
const controller = new auth_controller_js_1.AuthController();
// Rutas Públicas de Autenticación
router.post('/register', (0, validation_middleware_js_1.validateRequest)(auth_schemas_js_1.RegisterSchema), controller.register);
router.post('/login', (0, validation_middleware_js_1.validateRequest)(auth_schemas_js_1.LoginSchema), controller.login);
router.post('/refresh', (0, validation_middleware_js_1.validateRequest)(auth_schemas_js_1.RefreshTokenSchema), controller.refreshToken);
router.post('/forgot-password', (0, validation_middleware_js_1.validateRequest)(auth_schemas_js_1.ForgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', (0, validation_middleware_js_1.validateRequest)(auth_schemas_js_1.ResetPasswordSchema), controller.resetPassword);
// Rutas Protegidas (Requieren Bearer Token de Supabase)
router.get('/me', auth_middleware_js_1.requireAuth, controller.getMe);
router.put('/profile', auth_middleware_js_1.requireAuth, (0, validation_middleware_js_1.validateRequest)(auth_schemas_js_1.UpdateProfileSchema), controller.updateProfile);
router.post('/logout', auth_middleware_js_1.requireAuth, controller.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map