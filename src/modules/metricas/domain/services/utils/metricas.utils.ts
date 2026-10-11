import { RegistroHora } from "../../../../registros/domain/entities/registro-hora.entity";
import { HorasAgrupadas } from "../interfaces/metricas.interfaces";

// Métodos utilitarios (se recomienda extraer a helpers externos)
export function round(val: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

export function formatDateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseDateIso(dateIso: string): Date {
  const [y, m, d] = dateIso.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}

export function getDayKey(dayIndex: number): string {
    const map: Record<number, string> = {
      1: 'lunes',
      2: 'martes',
      3: 'miercoles',
      4: 'jueves',
      5: 'viernes',
      6: 'sabado',
      0: 'domingo',
    };
    return map[dayIndex] || 'lunes';
  }


export function obtenerRegDate(fecha: string): Date {
    const [y, m, d] = fecha.split('-').map(Number);
    return new Date(y!, m! - 1, d!);
}


export function estaEnMismoMes(regDate: Date, ref: Date): boolean {
    return regDate.getFullYear() === ref.getFullYear() && regDate.getMonth() === ref.getMonth();
  }

export function estaEnRangoSemana(regDate: Date, monday: Date, sunday: Date): boolean {
    return regDate >= monday && regDate <= sunday;
  }

export function obtenerDayKey(date: Date): string {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 ? '7' : dayOfWeek.toString();
  }


export function getMondayOfWeek(date: Date): Date {
    const currentDay = date.getDay();
    const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }


export function calcularHorasRegistradas(
    registros: RegistroHora[],
    now: Date,
    todayIso: string
  ): HorasAgrupadas {
    
 
    let horasRegistradasEnApp = 0;
    let horasRegistradasHoy = 0;
    let horasEstaSemana = 0;
    let horasEsteMes = 0;

    const diasUnicos = new Set<string>();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monday = getMondayOfWeek(now);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const horasPorDiaSemana: Record<string, number> = {
      '1': 0.0, '2': 0.0, '3': 0.0, '4': 0.0, '5': 0.0, '6': 0.0, '7': 0.0,
    };

    for (const reg of registros) {
      const horas = reg.horasComputables || 0;
      horasRegistradasEnApp += horas;
      diasUnicos.add(reg.fecha);

      if (reg.fecha === todayIso) {
        horasRegistradasHoy += horas;
      }

      const regDate = obtenerRegDate(reg.fecha);

      if (estaEnMismoMes(regDate, now)) {
        horasEsteMes += horas;
      }

      if (estaEnRangoSemana(regDate, monday, sunday)) {
        horasEstaSemana += horas;
        const dayKey = obtenerDayKey(regDate);
        horasPorDiaSemana[dayKey] = (horasPorDiaSemana[dayKey] || 0) + horas;
      }
    }

    Object.keys(horasPorDiaSemana).forEach(
      k => horasPorDiaSemana[k] = round(horasPorDiaSemana[k] || 0)
    );

    return {
      horasRegistradasEnApp: round(horasRegistradasEnApp),
      horasRegistradasHoy: round(horasRegistradasHoy),
      horasEstaSemana: round(horasEstaSemana),
      horasEsteMes: round(horasEsteMes),
      diasUnicos,
      horasPorDiaSemana,
    };
  }

