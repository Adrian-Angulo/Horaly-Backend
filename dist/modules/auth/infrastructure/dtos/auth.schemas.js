"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileSchema = exports.RefreshTokenSchema = exports.ResetPasswordSchema = exports.ForgotPasswordSchema = exports.LoginSchema = exports.RegisterSchema = exports.HorarioSemanalSchema = exports.DiaHorarioSchema = void 0;
const zod_1 = require("zod");
exports.DiaHorarioSchema = zod_1.z.object({
    diaSemana: zod_1.z.string().optional(),
    activo: zod_1.z.boolean().default(true),
    horaInicio: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Formato de hora inválido (HH:mm)')
        .default('08:00'),
    horaFin: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Formato de hora inválido (HH:mm)')
        .default('13:00'),
    refrigerioMinutos: zod_1.z
        .number()
        .int()
        .min(0)
        .max(180)
        .default(0),
    descuentoAlmuerzoMinutos: zod_1.z.number().int().min(0).max(180).optional(),
    modalidad: zod_1.z
        .enum(['Presencial', 'Remoto', 'Híbrido'])
        .default('Presencial'),
});
exports.HorarioSemanalSchema = zod_1.z.record(exports.DiaHorarioSchema);
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'El correo electrónico es requerido' })
        .email('El correo debe ser una dirección de email válida')
        .trim()
        .toLowerCase(),
    password: zod_1.z
        .string({ required_error: 'La contraseña es requerida' })
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    nombre: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    nombreCompleto: zod_1.z.string().min(2).optional(),
    carrera: zod_1.z.string().optional().default('Ingeniería de Software'),
    semestre: zod_1.z.string().optional().default('Semestre 2025-1'),
    fechaInicio: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
        .optional(),
    fechaFin: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
        .optional(),
    metaHorasTotal: zod_1.z.number().positive().max(1200).optional(),
    metaHoras: zod_1.z.number().positive().max(1200).optional(),
    horasInicialesPrevias: zod_1.z.number().min(0).optional(),
    horasMinimasSemanales: zod_1.z.number().min(0).optional(),
    perfilCompletado: zod_1.z.boolean().optional(),
    horarioSemanal: exports.HorarioSemanalSchema.optional(),
    horaInicioHabitual: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Formato de hora inválido (HH:mm)')
        .optional(),
    horaFinHabitual: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Formato de hora inválido (HH:mm)')
        .optional(),
    descuentoAlmuerzoHabitual: zod_1.z
        .number()
        .int()
        .min(0, 'El descuento no puede ser negativo')
        .max(180, 'El descuento máximo es de 180 min')
        .optional(),
    modalidadHabitual: zod_1.z
        .enum(['Presencial', 'Remoto', 'Híbrido'])
        .optional(),
}).refine((data) => Boolean(data.nombre || data.nombreCompleto), { message: 'El nombre es requerido', path: ['nombre'] });
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'El correo electrónico es requerido' })
        .email('Formato de correo inválido')
        .trim()
        .toLowerCase(),
    password: zod_1.z
        .string({ required_error: 'La contraseña es requerida' })
        .min(1, 'La contraseña no puede estar vacía'),
});
exports.ForgotPasswordSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'El correo electrónico es requerido' })
        .email('Formato de correo inválido')
        .trim()
        .toLowerCase(),
});
exports.ResetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string({ required_error: 'El token de recuperación es requerido' }).min(10, 'Token inválido'),
    newPassword: zod_1.z
        .string({ required_error: 'La nueva contraseña es requerida' })
        .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string({ required_error: 'El token de refresco es requerido' }).min(1, 'Refresh token no puede estar vacío'),
});
exports.UpdateProfileSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(2).optional(),
    nombreCompleto: zod_1.z.string().min(2).optional(),
    carrera: zod_1.z.string().optional(),
    semestre: zod_1.z.string().optional(),
    fechaInicio: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    fechaFin: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    metaHorasTotal: zod_1.z.number().positive().max(1200).optional(),
    metaHoras: zod_1.z.number().positive().max(1200).optional(),
    horasInicialesPrevias: zod_1.z.number().min(0).optional(),
    horasMinimasSemanales: zod_1.z.number().min(0).optional(),
    perfilCompletado: zod_1.z.boolean().optional(),
    horarioSemanal: exports.HorarioSemanalSchema.optional(),
    avatarUrl: zod_1.z.string().url().optional().nullable(),
});
//# sourceMappingURL=auth.schemas.js.map