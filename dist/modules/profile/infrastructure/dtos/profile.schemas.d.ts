import { z } from 'zod';
export declare const HorarioDiaSchema: z.ZodObject<{
    diaSemana: z.ZodOptional<z.ZodString>;
    activo: z.ZodBoolean;
    horaInicio: z.ZodString;
    horaFin: z.ZodString;
    refrigerioMinutos: z.ZodDefault<z.ZodNumber>;
    modalidad: z.ZodDefault<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
}, "strip", z.ZodTypeAny, {
    activo: boolean;
    horaInicio: string;
    horaFin: string;
    refrigerioMinutos: number;
    modalidad: "Presencial" | "Remoto" | "Híbrido";
    diaSemana?: string | undefined;
}, {
    activo: boolean;
    horaInicio: string;
    horaFin: string;
    refrigerioMinutos?: number | undefined;
    modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
    diaSemana?: string | undefined;
}>;
export declare const HorarioSemanalSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    diaSemana: z.ZodOptional<z.ZodString>;
    activo: z.ZodBoolean;
    horaInicio: z.ZodString;
    horaFin: z.ZodString;
    refrigerioMinutos: z.ZodDefault<z.ZodNumber>;
    modalidad: z.ZodDefault<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
}, "strip", z.ZodTypeAny, {
    activo: boolean;
    horaInicio: string;
    horaFin: string;
    refrigerioMinutos: number;
    modalidad: "Presencial" | "Remoto" | "Híbrido";
    diaSemana?: string | undefined;
}, {
    activo: boolean;
    horaInicio: string;
    horaFin: string;
    refrigerioMinutos?: number | undefined;
    modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
    diaSemana?: string | undefined;
}>>;
export declare const UpdateProfileSchema: z.ZodObject<{
    nombre: z.ZodOptional<z.ZodString>;
    nombreCompleto: z.ZodOptional<z.ZodString>;
    carrera: z.ZodOptional<z.ZodString>;
    semestre: z.ZodOptional<z.ZodString>;
    metaHorasTotal: z.ZodOptional<z.ZodNumber>;
    metaHoras: z.ZodOptional<z.ZodNumber>;
    horasInicialesPrevias: z.ZodOptional<z.ZodNumber>;
    horasMinimasSemanales: z.ZodOptional<z.ZodNumber>;
    perfilCompletado: z.ZodOptional<z.ZodBoolean>;
    fechaInicio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fechaFin: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    horarioSemanal: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        diaSemana: z.ZodOptional<z.ZodString>;
        activo: z.ZodBoolean;
        horaInicio: z.ZodString;
        horaFin: z.ZodString;
        refrigerioMinutos: z.ZodDefault<z.ZodNumber>;
        modalidad: z.ZodDefault<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
    }, "strip", z.ZodTypeAny, {
        activo: boolean;
        horaInicio: string;
        horaFin: string;
        refrigerioMinutos: number;
        modalidad: "Presencial" | "Remoto" | "Híbrido";
        diaSemana?: string | undefined;
    }, {
        activo: boolean;
        horaInicio: string;
        horaFin: string;
        refrigerioMinutos?: number | undefined;
        modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
        diaSemana?: string | undefined;
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
        activo: boolean;
        horaInicio: string;
        horaFin: string;
        refrigerioMinutos?: number | undefined;
        modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
        diaSemana?: string | undefined;
    }> | undefined;
    avatarUrl?: string | null | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
