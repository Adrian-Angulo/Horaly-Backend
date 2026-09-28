import {
  IAuthRepository,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  UpdateProfileDTO,
} from '../domain/repositories/auth.repository.js';
import { UserProfile, UserSession, defaultHorarioSemanal } from '../domain/entities/auth-user.entity.js';
import {
  AccountLockedError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../../core/errors/app-error.js';
import { getSupabaseAdmin, getSupabaseAnon } from '../../../config/supabase.config.js';
import { CryptoUtil } from '../../../core/utils/crypto.util.js';
import { ENV } from '../../../config/env.config.js';

export class SupabaseAuthRepository implements IAuthRepository {
  private readonly supabaseAdmin = getSupabaseAdmin();
  private readonly supabaseAnon = getSupabaseAnon();

  /**
   * Registro de nuevo usuario en Supabase Auth y creación de perfil
   */
  async register(data: RegisterDTO): Promise<UserSession> {
    const cleanEmail = data.email.trim().toLowerCase();
    const nombreFinal = data.nombre || data.nombreCompleto || cleanEmail.split('@')[0] || 'Practicante';
    const metaTotal = data.metaHorasTotal ?? data.metaHoras ?? 360;

    // 1. Crear usuario en Supabase Auth con metadata
    const { data: authData, error: authError } = await this.supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        nombre: nombreFinal,
        nombreCompleto: nombreFinal,
        carrera: data.carrera || 'Ingeniería de Software',
        semestre: data.semestre || 'Semestre 2025-1',
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        metaHorasTotal: metaTotal,
        metaHoras: metaTotal,
        horasInicialesPrevias: data.horasInicialesPrevias ?? 0,
        horasMinimasSemanales: data.horasMinimasSemanales ?? 30,
        perfilCompletado: data.perfilCompletado ?? false,
        horarioSemanal: data.horarioSemanal || defaultHorarioSemanal,
      },
    });

    if (authError || !authData.user) {
      if (authError?.message?.includes('already registered') || authError?.status === 422) {
        throw new ConflictError('Ya existe una cuenta registrada con este correo electrónico.');
      }
      throw new BadRequestError(authError?.message || 'Error al registrar el usuario en el sistema.');
    }

    const userId = authData.user.id;

    // 2. Asegurar inserción o actualización del perfil en public.perfiles
    const profileRecord: Record<string, any> = {
      id: userId,
      email: cleanEmail,
      nombre: nombreFinal,
      nombre_completo: nombreFinal,
      carrera: data.carrera || 'Ingeniería de Software',
      semestre: data.semestre || 'Semestre 2025-1',
      meta_horas_total: metaTotal,
      meta_horas: Math.round(metaTotal),
      horas_iniciales_previas: data.horasInicialesPrevias ?? 0,
      horas_minimas_semanales: data.horasMinimasSemanales ?? 30,
      perfil_completado: data.perfilCompletado ?? false,
      fecha_inicio: data.fechaInicio || null,
      fecha_fin: data.fechaFin || null,
      horario_semanal: data.horarioSemanal || defaultHorarioSemanal,
    };

    const { error: profileError } = await this.supabaseAdmin
      .from('perfiles')
      .upsert(profileRecord, { onConflict: 'id' });

    if (profileError) {
      console.error('Error insertando perfil en Supabase:', profileError);
      throw new BadRequestError(`Error al guardar perfil: ${profileError.message}`);
    }

    // 3. Iniciar sesión inmediata para generar token de acceso
    const { data: sessionData, error: sessionError } =
      await this.supabaseAnon.auth.signInWithPassword({
        email: cleanEmail,
        password: data.password,
      });

    const accessToken = sessionData?.session?.access_token || '';
    const refreshToken = sessionData?.session?.refresh_token;

    const userProfile: UserProfile = {
      id: userId,
      email: cleanEmail,
      nombre: nombreFinal,
      nombreCompleto: nombreFinal,
      carrera: data.carrera || 'Ingeniería de Software',
      semestre: data.semestre || 'Semestre 2025-1',
      fechaInicio: data.fechaInicio || null,
      fechaFin: data.fechaFin || null,
      metaHorasTotal: metaTotal,
      metaHoras: metaTotal,
      horasInicialesPrevias: data.horasInicialesPrevias ?? 0,
      horasMinimasSemanales: data.horasMinimasSemanales ?? 30,
      perfilCompletado: data.perfilCompletado ?? false,
      horarioSemanal: data.horarioSemanal || (defaultHorarioSemanal as any),
    };

    return {
      user: userProfile,
      token: accessToken,
      refreshToken,
      expiresIn: sessionData?.session?.expires_in,
    };
  }

  /**
   * Inicio de sesión con verificación de Anti-Fuerza Bruta
   */
  async login(data: LoginDTO): Promise<UserSession> {
    const cleanEmail = data.email.trim().toLowerCase();

    // 1. Verificar si la cuenta está bloqueada temporalmente
    await this.checkBruteForceLock(cleanEmail);

    // 2. Intentar autenticación en Supabase
    const { data: authData, error: authError } = await this.supabaseAnon.auth.signInWithPassword({
      email: cleanEmail,
      password: data.password,
    });

    if (authError || !authData.user || !authData.session) {
      await this.registerFailedAttempt(cleanEmail, data.ipAddress);
      throw new UnauthorizedError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }

    // 3. Resetear contador de intentos fallidos al tener éxito
    await this.resetFailedAttempts(cleanEmail);

    // 4. Obtener datos del perfil extendido
    const profile = await this.getProfileById(authData.user.id);

    const userProfile: UserProfile = profile || {
      id: authData.user.id,
      email: cleanEmail,
      nombre: authData.user.user_metadata?.['nombre'] || authData.user.user_metadata?.['nombreCompleto'] || cleanEmail.split('@')[0],
      nombreCompleto: authData.user.user_metadata?.['nombreCompleto'] || authData.user.user_metadata?.['nombre'] || cleanEmail.split('@')[0],
      metaHorasTotal: 360,
      metaHoras: 360,
      horasInicialesPrevias: 0,
      horasMinimasSemanales: 30,
      perfilCompletado: false,
      fechaInicio: null,
      fechaFin: null,
      horarioSemanal: defaultHorarioSemanal as any,
    };

    return {
      user: userProfile,
      token: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresIn: authData.session.expires_in,
    };
  }

  /**
   * Refrescar sesión usando un Refresh Token de Supabase
   */
  async refreshToken(refreshToken: string): Promise<UserSession> {
    const { data, error } = await this.supabaseAnon.auth.refreshSession({
      refresh_token: refreshToken.trim(),
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedError('Token de refresco inválido o expirado. Por favor inicia sesión nuevamente.');
    }

    const profile = await this.getProfileById(data.user.id);
    const cleanEmail = data.user.email || '';

    const userProfile: UserProfile = profile || {
      id: data.user.id,
      email: cleanEmail,
      nombre: data.user.user_metadata?.['nombre'] || data.user.user_metadata?.['nombreCompleto'] || cleanEmail.split('@')[0],
      nombreCompleto: data.user.user_metadata?.['nombreCompleto'] || data.user.user_metadata?.['nombre'] || cleanEmail.split('@')[0],
      metaHorasTotal: 360,
      metaHoras: 360,
      horasInicialesPrevias: 0,
      horasMinimasSemanales: 30,
      perfilCompletado: false,
      fechaInicio: null,
      fechaFin: null,
      horarioSemanal: defaultHorarioSemanal as any,
    };

    return {
      user: userProfile,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    };
  }

  /**
   * Solicitud de código / token seguro de recuperación
   */
  async requestPasswordReset(
    email: string,
    ipAddress?: string
  ): Promise<{ token: string; expiraEn: Date }> {
    const cleanEmail = email.trim().toLowerCase();

    const profile = await this.getProfileByEmail(cleanEmail);
    if (!profile) {
      return {
        token: 'token-simulado',
        expiraEn: new Date(Date.now() + ENV.RESET_TOKEN_EXPIRATION_MINUTES * 60 * 1000),
      };
    }

    // Invocar reset directo de Supabase Auth (envía el correo con el enlace mágico)
    try {
      const { error: resetError } = await this.supabaseAnon.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: ENV.CLIENT_ORIGIN ? `${ENV.CLIENT_ORIGIN}/reset-password` : undefined,
      });
      if (resetError) {
        console.warn(`[Supabase Auth] Aviso al enviar reset password para ${cleanEmail}:`, resetError.message);
      }
    } catch (e: any) {
      console.warn(`[Supabase Auth] Excepción al enviar reset password para ${cleanEmail}:`, e?.message);
    }

    const plainToken = CryptoUtil.generateRandomToken(24);
    const tokenHash = CryptoUtil.hashToken(plainToken);
    const expiraEn = new Date(Date.now() + ENV.RESET_TOKEN_EXPIRATION_MINUTES * 60 * 1000);

    try {
      await this.supabaseAdmin.from('tokens_recuperacion').insert({
        user_id: profile.id,
        email: cleanEmail,
        token_hash: tokenHash,
        expira_en: expiraEn.toISOString(),
        ip_solicitud: ipAddress,
      });
    } catch (_) {}

    return {
      token: plainToken,
      expiraEn,
    };
  }

  /**
   * Restablecimiento de contraseña mediante token validado
   */
  async resetPassword(data: ResetPasswordDTO): Promise<void> {
    const tokenHash = CryptoUtil.hashToken(data.token.trim());

    const { data: tokenRecord, error } = await this.supabaseAdmin
      .from('tokens_recuperacion')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('utilizado', false)
      .gt('expira_en', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !tokenRecord) {
      throw new BadRequestError('El enlace de recuperación es inválido o ha expirado.');
    }

    const userId = tokenRecord.user_id;

    const { error: updateAuthError } = await this.supabaseAdmin.auth.admin.updateUserById(userId, {
      password: data.newPassword,
    });

    if (updateAuthError) {
      throw new BadRequestError(
        updateAuthError.message || 'Error al actualizar la contraseña del usuario.'
      );
    }

    await this.supabaseAdmin
      .from('tokens_recuperacion')
      .update({
        utilizado: true,
        utilizado_en: new Date().toISOString(),
      })
      .eq('id', tokenRecord.id);
  }

  /**
   * Obtener perfil por ID de usuario
   */
  async getProfileById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabaseAdmin
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomainProfile(data);
  }

  /**
   * Obtener perfil por email
   */
  async getProfileByEmail(email: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabaseAdmin
      .from('perfiles')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomainProfile(data);
  }

  /**
   * Actualizar configuración de perfil
   */
  async updateProfile(userId: string, data: UpdateProfileDTO): Promise<UserProfile> {
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (data.nombre !== undefined || data.nombreCompleto !== undefined) {
      const n = data.nombre || data.nombreCompleto;
      updatePayload['nombre'] = n;
      updatePayload['nombre_completo'] = n;
    }
    if (data.carrera !== undefined) updatePayload['carrera'] = data.carrera;
    if (data.semestre !== undefined) updatePayload['semestre'] = data.semestre;
    if (data.fechaInicio !== undefined) updatePayload['fecha_inicio'] = data.fechaInicio;
    if (data.fechaFin !== undefined) updatePayload['fecha_fin'] = data.fechaFin;
    if (data.metaHorasTotal !== undefined || data.metaHoras !== undefined) {
      const m = data.metaHorasTotal ?? data.metaHoras;
      updatePayload['meta_horas_total'] = m;
      updatePayload['meta_horas'] = Math.round(m!);
    }
    if (data.horasInicialesPrevias !== undefined) updatePayload['horas_iniciales_previas'] = data.horasInicialesPrevias;
    if (data.horasMinimasSemanales !== undefined) updatePayload['horas_minimas_semanales'] = data.horasMinimasSemanales;
    if (data.perfilCompletado !== undefined) updatePayload['perfil_completado'] = data.perfilCompletado;
    if (data.horarioSemanal !== undefined) updatePayload['horario_semanal'] = data.horarioSemanal;
    if (data.avatarUrl !== undefined) updatePayload['avatar_url'] = data.avatarUrl;

    const { data: updated, error } = await this.supabaseAdmin
      .from('perfiles')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (error || !updated) {
      throw new BadRequestError('Error al actualizar el perfil del usuario.');
    }

    return this.mapToDomainProfile(updated);
  }

  /**
   * Cierre de sesión y revocación
   */
  async logout(token: string): Promise<void> {
    try {
      await this.supabaseAnon.auth.admin.signOut(token);
    } catch {
      // Ignorar error si el token ya no es válido en Supabase
    }
  }

  // ============================================================================
  // MÉTODOS PRIVADOS: Anti-Fuerza Bruta & Mappers
  // ============================================================================

  private async checkBruteForceLock(email: string): Promise<void> {
    const { data } = await this.supabaseAdmin
      .from('intentos_login')
      .select('intentos_fallidos, bloqueado_hasta')
      .eq('email', email)
      .maybeSingle();

    if (data && data.bloqueado_hasta) {
      const lockDate = new Date(data.bloqueado_hasta);
      const now = new Date();
      if (lockDate > now) {
        const minutesLeft = Math.ceil((lockDate.getTime() - now.getTime()) / (1000 * 60));
        throw new AccountLockedError(minutesLeft);
      }
    }
  }

  private async registerFailedAttempt(email: string, ipAddress?: string): Promise<void> {
    const { data } = await this.supabaseAdmin
      .from('intentos_login')
      .select('id, intentos_fallidos')
      .eq('email', email)
      .maybeSingle();

    const currentAttempts = (data?.intentos_fallidos || 0) + 1;
    let bloqueadoHasta: string | null = null;

    if (currentAttempts >= ENV.LOGIN_MAX_FAILED_ATTEMPTS) {
      const lockDate = new Date(Date.now() + ENV.LOGIN_LOCKOUT_MINUTES * 60 * 1000);
      bloqueadoHasta = lockDate.toISOString();
    }

    await this.supabaseAdmin.from('intentos_login').upsert(
      {
        email,
        intentos_fallidos: currentAttempts,
        bloqueado_hasta: bloqueadoHasta,
        ultimo_intento: new Date().toISOString(),
        ip_origen: ipAddress,
      },
      { onConflict: 'email' }
    );
  }

  private async resetFailedAttempts(email: string): Promise<void> {
    await this.supabaseAdmin.from('intentos_login').delete().eq('email', email);
  }

  private mapToDomainProfile(raw: any): UserProfile {
    const parseNum = (val: any, fallback: number): number => {
      if (val === null || val === undefined) return fallback;
      const parsed = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(parsed) ? fallback : parsed;
    };

    const nombre = raw.nombre || raw.nombre_completo || raw.email.split('@')[0] || 'Practicante';

    return {
      id: raw.id,
      email: raw.email,
      nombre: nombre,
      nombreCompleto: raw.nombre_completo || nombre,
      carrera: raw.carrera || 'Ingeniería de Software',
      semestre: raw.semestre || 'Semestre 2025-1',
      metaHorasTotal: parseNum(raw.meta_horas_total ?? raw.meta_horas, 360),
      metaHoras: parseNum(raw.meta_horas ?? raw.meta_horas_total, 360),
      horasInicialesPrevias: parseNum(raw.horas_iniciales_previas, 0),
      horasMinimasSemanales: parseNum(raw.horas_minimas_semanales, 30),
      perfilCompletado: Boolean(raw.perfil_completado),
      fechaInicio: raw.fecha_inicio ? raw.fecha_inicio.split('T')[0] : null,
      fechaFin: raw.fecha_fin ? raw.fecha_fin.split('T')[0] : null,
      horarioSemanal: raw.horario_semanal || defaultHorarioSemanal,
      avatarUrl: raw.avatar_url || undefined,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }
}

