import { IAuthRepository } from '../domain/repositories/auth.repository.js';
import { UserSession } from '../domain/entities/auth-user.entity.js';
import { BadRequestError } from '../../../core/errors/app-error.js';

export class RefreshTokenUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(refreshToken: string): Promise<UserSession> {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new BadRequestError('El token de refresco es requerido.');
    }

    return this.authRepository.refreshToken(refreshToken);
  }
}
