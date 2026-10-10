import { z } from 'zod';
export declare const SyncBatchSchema: z.ZodObject<{
    perfil: z.ZodOptional<z.ZodObject<{
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
    }>>;
    registros: z.ZodOptional<z.ZodObject<{
        creados: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            fecha: z.ZodString;
            horaInicio: z.ZodString;
            horaFin: z.ZodString;
            descuentoAlmuerzoMinutos: z.ZodOptional<z.ZodNumber>;
            refrigerioMinutos: z.ZodOptional<z.ZodNumber>;
            horasComputables: z.ZodOptional<z.ZodNumber>;
            modalidad: z.ZodDefault<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
            actividades: z.ZodString;
            supervisorNombre: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            estado: z.ZodOptional<z.ZodEnum<["Borrador", "Pendiente", "Aprobado", "Observado"]>>;
            createdAt: z.ZodOptional<z.ZodString>;
            updatedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            horaInicio: string;
            horaFin: string;
            modalidad: "Presencial" | "Remoto" | "Híbrido";
            fecha: string;
            actividades: string;
            refrigerioMinutos?: number | undefined;
            id?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        }, {
            horaInicio: string;
            horaFin: string;
            fecha: string;
            actividades: string;
            refrigerioMinutos?: number | undefined;
            modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
            id?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        }>, "many">>>;
        actualizados: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            fecha: z.ZodOptional<z.ZodString>;
            horaInicio: z.ZodOptional<z.ZodString>;
            horaFin: z.ZodOptional<z.ZodString>;
            descuentoAlmuerzoMinutos: z.ZodOptional<z.ZodNumber>;
            refrigerioMinutos: z.ZodOptional<z.ZodNumber>;
            horasComputables: z.ZodOptional<z.ZodNumber>;
            modalidad: z.ZodOptional<z.ZodEnum<["Presencial", "Remoto", "Híbrido"]>>;
            actividades: z.ZodOptional<z.ZodString>;
            supervisorNombre: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            estado: z.ZodOptional<z.ZodEnum<["Borrador", "Pendiente", "Aprobado", "Observado"]>>;
            updatedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            horaInicio?: string | undefined;
            horaFin?: string | undefined;
            refrigerioMinutos?: number | undefined;
            modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
            fecha?: string | undefined;
            actividades?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            updatedAt?: string | undefined;
        }, {
            id: string;
            horaInicio?: string | undefined;
            horaFin?: string | undefined;
            refrigerioMinutos?: number | undefined;
            modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
            fecha?: string | undefined;
            actividades?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            updatedAt?: string | undefined;
        }>, "many">>>;
        eliminadosIds: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        creados: {
            horaInicio: string;
            horaFin: string;
            modalidad: "Presencial" | "Remoto" | "Híbrido";
            fecha: string;
            actividades: string;
            refrigerioMinutos?: number | undefined;
            id?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        }[];
        actualizados: {
            id: string;
            horaInicio?: string | undefined;
            horaFin?: string | undefined;
            refrigerioMinutos?: number | undefined;
            modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
            fecha?: string | undefined;
            actividades?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            updatedAt?: string | undefined;
        }[];
        eliminadosIds: string[];
    }, {
        creados?: {
            horaInicio: string;
            horaFin: string;
            fecha: string;
            actividades: string;
            refrigerioMinutos?: number | undefined;
            modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
            id?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        }[] | undefined;
        actualizados?: {
            id: string;
            horaInicio?: string | undefined;
            horaFin?: string | undefined;
            refrigerioMinutos?: number | undefined;
            modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
            fecha?: string | undefined;
            actividades?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            updatedAt?: string | undefined;
        }[] | undefined;
        eliminadosIds?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    registros?: {
        creados: {
            horaInicio: string;
            horaFin: string;
            modalidad: "Presencial" | "Remoto" | "Híbrido";
            fecha: string;
            actividades: string;
            refrigerioMinutos?: number | undefined;
            id?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        }[];
        actualizados: {
            id: string;
            horaInicio?: string | undefined;
            horaFin?: string | undefined;
            refrigerioMinutos?: number | undefined;
            modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
            fecha?: string | undefined;
            actividades?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            updatedAt?: string | undefined;
        }[];
        eliminadosIds: string[];
    } | undefined;
    perfil?: {
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
    } | undefined;
}, {
    registros?: {
        creados?: {
            horaInicio: string;
            horaFin: string;
            fecha: string;
            actividades: string;
            refrigerioMinutos?: number | undefined;
            modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
            id?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        }[] | undefined;
        actualizados?: {
            id: string;
            horaInicio?: string | undefined;
            horaFin?: string | undefined;
            refrigerioMinutos?: number | undefined;
            modalidad?: "Presencial" | "Remoto" | "Híbrido" | undefined;
            fecha?: string | undefined;
            actividades?: string | undefined;
            descuentoAlmuerzoMinutos?: number | undefined;
            estado?: "Borrador" | "Pendiente" | "Aprobado" | "Observado" | undefined;
            horasComputables?: number | undefined;
            supervisorNombre?: string | null | undefined;
            updatedAt?: string | undefined;
        }[] | undefined;
        eliminadosIds?: string[] | undefined;
    } | undefined;
    perfil?: {
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
    } | undefined;
}>;
export type SyncBatchInput = z.infer<typeof SyncBatchSchema>;
