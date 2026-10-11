import { ModalidadTrabajo } from "../config/auth.constans";
export interface HorarioDia {
    diaSemana: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo' | string;
    activo: boolean;
    horaInicio: string;
    horaFin: string;
    refrigerioMinutos: number;
    modalidad: ModalidadTrabajo;
}
export type HorarioSemanal = {
    lunes: HorarioDia;
    martes: HorarioDia;
    miercoles: HorarioDia;
    jueves: HorarioDia;
    viernes: HorarioDia;
    sabado: HorarioDia;
    domingo: HorarioDia;
};
