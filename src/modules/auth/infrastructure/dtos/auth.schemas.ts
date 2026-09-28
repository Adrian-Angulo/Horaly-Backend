import { z } from 'zod';

export const DiaHorarioSchema = z.object({
  diaSemana: z.string().optional(),
  activo: z.boolean().default(true),
  horaInicio: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Formato de hora inválido (HH:mm)')
    .default('08:00'),
  horaFin: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Formato de hora inválido (HH:mm)')
    .default('13:00'),
  refrigerioMinutos: z
    .number()
    .int()
    .min(0)
    .max(180)
    .default(0),
  descuentoAlmuerzoMinutos: z.number().int().min(0).max(180).optional(),
  modalidad: z
    .enum(['Presencial', 'Remoto', 'Híbrido'])
    .default('Presencial'),
});

export const HorarioSemanalSchema = z.record(DiaHorarioSchema);

export const RegisterSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('El correo debe ser una dirección de email válida')
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  nombreCompleto: z.string().min(2).optional(),
  carrera: z.string().optional().default('Ingeniería de Software'),
  semestre: z.string().optional().default('Semestre 2025-1'),
  fechaInicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .optional(),
  fechaFin: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .optional(),
  metaHorasTotal: z.number().positive().max(1200).optional(),
  metaHoras: z.number().positive().max(1200).optional(),
  horasInicialesPrevias: z.number().min(0).optional(),
  horasMinimasSemanales: z.number().min(0).optional(),
  perfilCompletado: z.boolean().optional(),
  horarioSemanal: HorarioSemanalSchema.optional(),
  horaInicioHabitual: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Formato de hora inválido (HH:mm)')
    .optional(),
  horaFinHabitual: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Formato de hora inválido (HH:mm)')
    .optional(),
  descuentoAlmuerzoHabitual: z
    .number()
    .int()
    .min(0, 'El descuento no puede ser negativo')
    .max(180, 'El descuento máximo es de 180 min')
    .optional(),
  modalidadHabitual: z
    .enum(['Presencial', 'Remoto', 'Híbrido'])
    .optional(),
}).refine(
  (data) => Boolean(data.nombre || data.nombreCompleto),
  { message: 'El nombre es requerido', path: ['nombre'] }
);

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Formato de correo inválido')
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(1, 'La contraseña no puede estar vacía'),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Formato de correo inválido')
    .trim()
    .toLowerCase(),
});

export const ResetPasswordSchema = z.object({
  token: z.string({ required_error: 'El token de recuperación es requerido' }).min(10, 'Token inválido'),
  newPassword: z
    .string({ required_error: 'La nueva contraseña es requerida' })
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string({ required_error: 'El token de refresco es requerido' }).min(1, 'Refresh token no puede estar vacío'),
});

export const UpdateProfileSchema = z.object({
  nombre: z.string().min(2).optional(),
  nombreCompleto: z.string().min(2).optional(),
  carrera: z.string().optional(),
  semestre: z.string().optional(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  metaHorasTotal: z.number().positive().max(1200).optional(),
  metaHoras: z.number().positive().max(1200).optional(),
  horasInicialesPrevias: z.number().min(0).optional(),
  horasMinimasSemanales: z.number().min(0).optional(),
  perfilCompletado: z.boolean().optional(),
  horarioSemanal: HorarioSemanalSchema.optional(),
  avatarUrl: z.string().url().optional().nullable(),
});
