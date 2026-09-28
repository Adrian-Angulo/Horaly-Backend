import { z } from 'zod';
export declare const DiaHorarioSchema: z.ZodObject<{
    diaSemana: z.ZodOptional<z.ZodString>;
    activo: z.ZodDefault<z.ZodBoolean>;
    horaInicio: z.ZodDefault<z.ZodString>;
    horaFin: z.ZodDefault<z.ZodString>;
    refrigerioMinutos: z.ZodDefault<z.ZodNumber>;
    descuentoAlmuerzoMinutos: z.ZodOptional<z.ZodNumber>;
    modalidad: z.ZodDefault<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
}, "strip", z.ZodTypeAny, {
    activo: boolean;
    horaInicio: string;
    horaFin: string;
    refrigerioMinutos: number;
    modalidad: "Presencial" | "Remoto" | "Híbrido";
    diaSemana?: string | undefined;
    descuentoAlmuerzoMinutos?: number | undefined;
}, {
    diaSemana?: string | undefined;
    activo?: boolean | undefined;
    horaInicio?: string | undefined;
    horaFin?: string | undefined;
    refrigerioMinutos?: number | undefined;
    descuentoAlmuerzoMinutos?: number | undefined;
    modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
}>;
export declare const HorarioSemanalSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    diaSemana: z.ZodOptional<z.ZodString>;
    activo: z.ZodDefault<z.ZodBoolean>;
    horaInicio: z.ZodDefault<z.ZodString>;
    horaFin: z.ZodDefault<z.ZodString>;
    refrigerioMinutos: z.ZodDefault<z.ZodNumber>;
    descuentoAlmuerzoMinutos: z.ZodOptional<z.ZodNumber>;
    modalidad: z.ZodDefault<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
}, "strip", z.ZodTypeAny, {
    activo: boolean;
    horaInicio: string;
    horaFin: string;
    refrigerioMinutos: number;
    modalidad: "Presencial" | "Remoto" | "Híbrido";
    diaSemana?: string | undefined;
    descuentoAlmuerzoMinutos?: number | undefined;
}, {
    diaSemana?: string | undefined;
    activo?: boolean | undefined;
    horaInicio?: string | undefined;
    horaFin?: string | undefined;
    refrigerioMinutos?: number | undefined;
    descuentoAlmuerzoMinutos?: number | undefined;
    modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
}>>;
export declare const RegisterSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    nombre: z.ZodOptional<z.ZodString>;
    nombreCompleto: z.ZodOptional<z.ZodString>;
    carrera: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    semestre: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    fechaInicio: z.ZodOptional<z.ZodString>;
    fechaFin: z.ZodOptional<z.ZodString>;
    metaHorasTotal: z.ZodOptional<z.ZodNumber>;
    metaHoras: z.ZodOptional<z.ZodNumber>;
    horasInicialesPrevias: z.ZodOptional<z.ZodNumber>;
    horasMinimasSemanales: z.ZodOptional<z.ZodNumber>;
    perfilCompletado: z.ZodOptional<z.ZodBoolean>;
    horarioSemanal: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        diaSemana: z.ZodOptional<z.ZodString>;
        activo: z.ZodDefault<z.ZodBoolean>;
        horaInicio: z.ZodDefault<z.ZodString>;
        horaFin: z.ZodDefault<z.ZodString>;
        refrigerioMinutos: z.ZodDefault<z.ZodNumber>;
        descuentoAlmuerzoMinutos: z.ZodOptional<z.ZodNumber>;
        modalidad: z.ZodDefault<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
    }, "strip", z.ZodTypeAny, {
        activo: boolean;
        horaInicio: string;
        horaFin: string;
        refrigerioMinutos: number;
        modalidad: "Presencial" | "Remoto" | "Híbrido";
        diaSemana?: string | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
    }, {
        diaSemana?: string | undefined;
        activo?: boolean | undefined;
        horaInicio?: string | undefined;
        horaFin?: string | undefined;
        refrigerioMinutos?: number | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
        modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
    }>>>;
    horaInicioHabitual: z.ZodOptional<z.ZodString>;
    horaFinHabitual: z.ZodOptional<z.ZodString>;
    descuentoAlmuerzoHabitual: z.ZodOptional<z.ZodNumber>;
    modalidadHabitual: z.ZodOptional<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    carrera: string;
    semestre: string;
    nombre?: string | undefined;
    nombreCompleto?: string | undefined;
    fechaInicio?: string | undefined;
    fechaFin?: string | undefined;
    metaHorasTotal?: number | undefined;
    metaHoras?: number | undefined;
    horasInicialesPrevias?: number | undefined;
    horasMinimasSemanales?: number | undefined;
    perfilCompletado?: boolean | undefined;
    horarioSemanal?: Record<string, {
        activo: boolean;
        horaInicio: string;
        horaFin: string;
        refrigerioMinutos: number;
        modalidad: "Presencial" | "Remoto" | "Híbrido";
        diaSemana?: string | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
    }> | undefined;
    horaInicioHabitual?: string | undefined;
    horaFinHabitual?: string | undefined;
    descuentoAlmuerzoHabitual?: number | undefined;
    modalidadHabitual?: "Presencial" | "Remoto" | "Híbrido" | undefined;
}, {
    email: string;
    password: string;
    nombre?: string | undefined;
    nombreCompleto?: string | undefined;
    fechaInicio?: string | undefined;
    fechaFin?: string | undefined;
    metaHorasTotal?: number | undefined;
    metaHoras?: number | undefined;
    carrera?: string | undefined;
    semestre?: string | undefined;
    horasInicialesPrevias?: number | undefined;
    horasMinimasSemanales?: number | undefined;
    perfilCompletado?: boolean | undefined;
    horarioSemanal?: Record<string, {
        diaSemana?: string | undefined;
        activo?: boolean | undefined;
        horaInicio?: string | undefined;
        horaFin?: string | undefined;
        refrigerioMinutos?: number | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
        modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
    }> | undefined;
    horaInicioHabitual?: string | undefined;
    horaFinHabitual?: string | undefined;
    descuentoAlmuerzoHabitual?: number | undefined;
    modalidadHabitual?: "Presencial" | "Remoto" | "Híbrido" | undefined;
}>, {
    email: string;
    password: string;
    carrera: string;
    semestre: string;
    nombre?: string | undefined;
    nombreCompleto?: string | undefined;
    fechaInicio?: string | undefined;
    fechaFin?: string | undefined;
    metaHorasTotal?: number | undefined;
    metaHoras?: number | undefined;
    horasInicialesPrevias?: number | undefined;
    horasMinimasSemanales?: number | undefined;
    perfilCompletado?: boolean | undefined;
    horarioSemanal?: Record<string, {
        activo: boolean;
        horaInicio: string;
        horaFin: string;
        refrigerioMinutos: number;
        modalidad: "Presencial" | "Remoto" | "Híbrido";
        diaSemana?: string | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
    }> | undefined;
    horaInicioHabitual?: string | undefined;
    horaFinHabitual?: string | undefined;
    descuentoAlmuerzoHabitual?: number | undefined;
    modalidadHabitual?: "Presencial" | "Remoto" | "Híbrido" | undefined;
}, {
    email: string;
    password: string;
    nombre?: string | undefined;
    nombreCompleto?: string | undefined;
    fechaInicio?: string | undefined;
    fechaFin?: string | undefined;
    metaHorasTotal?: number | undefined;
    metaHoras?: number | undefined;
    carrera?: string | undefined;
    semestre?: string | undefined;
    horasInicialesPrevias?: number | undefined;
    horasMinimasSemanales?: number | undefined;
    perfilCompletado?: boolean | undefined;
    horarioSemanal?: Record<string, {
        diaSemana?: string | undefined;
        activo?: boolean | undefined;
        horaInicio?: string | undefined;
        horaFin?: string | undefined;
        refrigerioMinutos?: number | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
        modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
    }> | undefined;
    horaInicioHabitual?: string | undefined;
    horaFinHabitual?: string | undefined;
    descuentoAlmuerzoHabitual?: number | undefined;
    modalidadHabitual?: "Presencial" | "Remoto" | "Híbrido" | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const ForgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const ResetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    newPassword: string;
}, {
    token: string;
    newPassword: string;
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const UpdateProfileSchema: z.ZodObject<{
    nombre: z.ZodOptional<z.ZodString>;
    nombreCompleto: z.ZodOptional<z.ZodString>;
    carrera: z.ZodOptional<z.ZodString>;
    semestre: z.ZodOptional<z.ZodString>;
    fechaInicio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fechaFin: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaHorasTotal: z.ZodOptional<z.ZodNumber>;
    metaHoras: z.ZodOptional<z.ZodNumber>;
    horasInicialesPrevias: z.ZodOptional<z.ZodNumber>;
    horasMinimasSemanales: z.ZodOptional<z.ZodNumber>;
    perfilCompletado: z.ZodOptional<z.ZodBoolean>;
    horarioSemanal: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        diaSemana: z.ZodOptional<z.ZodString>;
        activo: z.ZodDefault<z.ZodBoolean>;
        horaInicio: z.ZodDefault<z.ZodString>;
        horaFin: z.ZodDefault<z.ZodString>;
        refrigerioMinutos: z.ZodDefault<z.ZodNumber>;
        descuentoAlmuerzoMinutos: z.ZodOptional<z.ZodNumber>;
        modalidad: z.ZodDefault<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
    }, "strip", z.ZodTypeAny, {
        activo: boolean;
        horaInicio: string;
        horaFin: string;
        refrigerioMinutos: number;
        modalidad: "Presencial" | "Remoto" | "Híbrido";
        diaSemana?: string | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
    }, {
        diaSemana?: string | undefined;
        activo?: boolean | undefined;
        horaInicio?: string | undefined;
        horaFin?: string | undefined;
        refrigerioMinutos?: number | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
        modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
    }>>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    nombre?: string | undefined;
    nombreCompleto?: string | undefined;
    fechaInicio?: string | null | undefined;
    fechaFin?: string | null | undefined;
    metaHorasTotal?: number | undefined;
    metaHoras?: number | undefined;
    carrera?: string | undefined;
    semestre?: string | undefined;
    horasInicialesPrevias?: number | undefined;
    horasMinimasSemanales?: number | undefined;
    perfilCompletado?: boolean | undefined;
    horarioSemanal?: Record<string, {
        activo: boolean;
        horaInicio: string;
        horaFin: string;
        refrigerioMinutos: number;
        modalidad: "Presencial" | "Remoto" | "Híbrido";
        diaSemana?: string | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
    }> | undefined;
    avatarUrl?: string | null | undefined;
}, {
    nombre?: string | undefined;
    nombreCompleto?: string | undefined;
    fechaInicio?: string | null | undefined;
    fechaFin?: string | null | undefined;
    metaHorasTotal?: number | undefined;
    metaHoras?: number | undefined;
    carrera?: string | undefined;
    semestre?: string | undefined;
    horasInicialesPrevias?: number | undefined;
    horasMinimasSemanales?: number | undefined;
    perfilCompletado?: boolean | undefined;
    horarioSemanal?: Record<string, {
        diaSemana?: string | undefined;
        activo?: boolean | undefined;
        horaInicio?: string | undefined;
        horaFin?: string | undefined;
        refrigerioMinutos?: number | undefined;
        descuentoAlmuerzoMinutos?: number | undefined;
        modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
    }> | undefined;
    avatarUrl?: string | null | undefined;
}>;
