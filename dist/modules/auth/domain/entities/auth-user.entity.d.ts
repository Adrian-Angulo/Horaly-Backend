import { HorarioSemanal } from "../interfaces/auth.interface";
export interface UserProfile {
    id: string;
    email: string;
    nombre: string;
    nombreCompleto?: string;
    carrera?: string;
    semestre?: string;
    metaHorasTotal: number;
    metaHoras?: number;
    horasInicialesPrevias: number;
    horasMinimasSemanales: number;
    perfilCompletado: boolean;
    fechaInicio?: string | null;
    fechaFin?: string | null;
    horarioSemanal: HorarioSemanal;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface UserSession {
    user: UserProfile;
    token: string;
    refreshToken?: string;
    expiresIn?: number;
}
