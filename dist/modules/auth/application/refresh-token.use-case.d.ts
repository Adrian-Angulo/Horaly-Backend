import { IAuthRepository } from '../domain/repositories/auth.repository.js';
import { UserSession } from '../domain/entities/auth-user.entity.js';
export declare class RefreshTokenUseCase {
    private readonly authRepository;
    constructor(authRepository: IAuthRepository);
    execute(refreshToken: string): Promise<UserSession>;
}
