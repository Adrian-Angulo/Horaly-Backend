import { IAuthRepository, LoginDTO, RegisterDTO, ResetPasswordDTO, UpdateProfileDTO } from '../domain/repositories/auth.repository.js';
import { UserProfile, UserSession } from '../domain/entities/auth-user.entity.js';
export declare class SupabaseAuthRepository implements IAuthRepository {
    private readonly supabaseAdmin;
    private readonly supabaseAnon;
    /**
     * Registro de nuevo usuario en Supabase Auth y creación de perfil
     */
    register(data: RegisterDTO): Promise<UserSession>;
    /**
     * Inicio de sesión con verificación de Anti-Fuerza Bruta
     */
    login(data: LoginDTO): Promise<UserSession>;
    /**
     * Refrescar sesión usando un Refresh Token de Supabase
     */
    refreshToken(refreshToken: string): Promise<UserSession>;
    /**
     * Solicitud de código / token seguro de recuperación
     */
    requestPasswordReset(email: string, ipAddress?: string): Promise<{
        token: string;
        expiraEn: Date;
    }>;
    /**
     * Restablecimiento de contraseña mediante token validado
     */
    resetPassword(data: ResetPasswordDTO): Promise<void>;
    /**
     * Obtener perfil por ID de usuario
     */
    getProfileById(userId: string): Promise<UserProfile | null>;
    /**
     * Obtener perfil por email
     */
    getProfileByEmail(email: string): Promise<UserProfile | null>;
    /**
     * Actualizar configuración de perfil
     */
    updateProfile(userId: string, data: UpdateProfileDTO): Promise<UserProfile>;
    /**
     * Cierre de sesión y revocación
     */
    logout(token: string): Promise<void>;
    private checkBruteForceLock;
    private registerFailedAttempt;
    private resetFailedAttempts;
    private mapToDomainProfile;
}
