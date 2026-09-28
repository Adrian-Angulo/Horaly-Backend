"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenUseCase = void 0;
const app_error_js_1 = require("../../../core/errors/app-error.js");
class RefreshTokenUseCase {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(refreshToken) {
        if (!refreshToken || typeof refreshToken !== 'string') {
            throw new app_error_js_1.BadRequestError('El token de refresco es requerido.');
        }
        return this.authRepository.refreshToken(refreshToken);
    }
}
exports.RefreshTokenUseCase = RefreshTokenUseCase;
//# sourceMappingURL=refresh-token.use-case.js.map