import { Perfil } from '../../../profile/domain/entities/profile.entity.js';
import { RegistroHora } from '../../../registros/domain/entities/registro-hora.entity.js';
import { EstadoRitmo, MetricasDashboard } from '../entities/metricas-dashboard.entity.js';

interface CalendarioHabiles {
  totalDiasHabiles: number;
  diasHabilesCerrados: number;
  esHoyHabil: boolean;
  diasHabilesFuturos: number;
}

interface HorasAgrupadas {
  horasRegistradasEnApp: number;
  horasRegistradasHoy: number;
  horasEstaSemana: number;
  horasEsteMes: number;
  diasUnicos: Set<string>;
  horasPorDiaSemana: Record<string, number>;
}

export class PacingEngineService {
  private static readonly UMBRAL_TOLERANCIA_HORAS = 3.0;
  private static readonly JORNADA_MAXIMA_HABITUAL = 6.0;

  private static round(val: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  private static formatDateIso(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private static getDayKey(dayIndex: number): string {
    // 0: Domingo, 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado
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

  private static obtenerDiasActivosMap(perfil: Perfil): Record<string, boolean> {
    const activeDaysMap: Record<string, boolean> = {};
    let anyActive = false;

    if (perfil.horarioSemanal) {
      for (const [dayName, schedule] of Object.entries(perfil.horarioSemanal)) {
        if (schedule && schedule.activo) {
          activeDaysMap[dayName] = true;
          anyActive = true;
        }
      }
    }

    if (!anyActive) {
      activeDaysMap['lunes'] = true;
      activeDaysMap['martes'] = true;
      activeDaysMap['miercoles'] = true;
      activeDaysMap['jueves'] = true;
      activeDaysMap['viernes'] = true;
    }

    return activeDaysMap;
  }

  private static calcularCalendarioHabiles(
    perfil: Perfil,
    todayIso: string
  ): CalendarioHabiles {
    const [startYear, startMonth, startDay] = perfil.fechaInicio!.split('-').map(Number);
    const [endYear, endMonth, endDay] = perfil.fechaFin!.split('-').map(Number);

    const startDate = new Date(startYear!, startMonth! - 1, startDay!);
    const endDate = new Date(endYear!, endMonth! - 1, endDay!);

    const activeDaysMap = this.obtenerDiasActivosMap(perfil);

    let totalDiasHabiles = 0;
    let diasHabilesCerrados = 0;
    let esHoyHabil = false;
    let diasHabilesFuturos = 0;

    const curr = new Date(startDate);
    while (curr <= endDate) {
      const dayOfWeek = curr.getDay();
      const dayKey = this.getDayKey(dayOfWeek);

      if (activeDaysMap[dayKey]) {
        totalDiasHabiles++;
        const currIso = this.formatDateIso(curr);

        if (currIso < todayIso) {
          diasHabilesCerrados++;
        } else if (currIso === todayIso) {
          esHoyHabil = true;
        } else {
          diasHabilesFuturos++;
        }
      }

      curr.setDate(curr.getDate() + 1);
    }

    return {
      totalDiasHabiles,
      diasHabilesCerrados,
      esHoyHabil,
      diasHabilesFuturos,
    };
  }

  private static calcularHorasRegistradas(
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

    const currentDay = now.getDay();
    const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const horasPorDiaSemana: Record<string, number> = {
      '1': 0.0,
      '2': 0.0,
      '3': 0.0,
      '4': 0.0,
      '5': 0.0,
      '6': 0.0,
      '7': 0.0,
    };

    for (const reg of registros) {
      const horas = reg.horasComputables || 0;
      horasRegistradasEnApp += horas;
      diasUnicos.add(reg.fecha);

      if (reg.fecha === todayIso) {
        horasRegistradasHoy += horas;
      }

      const [y, m, d] = reg.fecha.split('-').map(Number);
      const regDate = new Date(y!, m! - 1, d!);

      if (regDate.getFullYear() === currentYear && regDate.getMonth() === currentMonth) {
        horasEsteMes += horas;
      }

      if (regDate >= monday && regDate <= sunday) {
        horasEstaSemana += horas;
        const dayOfWeek = regDate.getDay();
        const dayKey = dayOfWeek === 0 ? '7' : dayOfWeek.toString();
        horasPorDiaSemana[dayKey] = (horasPorDiaSemana[dayKey] || 0) + horas;
      }
    }

    for (const k of Object.keys(horasPorDiaSemana)) {
      horasPorDiaSemana[k] = this.round(horasPorDiaSemana[k] || 0);
    }

    return {
      horasRegistradasEnApp: this.round(horasRegistradasEnApp),
      horasRegistradasHoy: this.round(horasRegistradasHoy),
      horasEstaSemana: this.round(horasEstaSemana),
      horasEsteMes: this.round(horasEsteMes),
      diasUnicos,
      horasPorDiaSemana,
    };
  }

  static calcularMetricas(
    perfil: Perfil,
    registros: RegistroHora[],
    now: Date = new Date()
  ): MetricasDashboard {
    const metaHorasTotal = perfil.metaHorasTotal || 360;
    const horasPreviasCursadas = perfil.horasInicialesPrevias || 0;
    const todayIso = this.formatDateIso(now);

    const {
      horasRegistradasEnApp,
      horasRegistradasHoy,
      horasEstaSemana,
      horasEsteMes,
      diasUnicos,
      horasPorDiaSemana,
    } = this.calcularHorasRegistradas(registros, now, todayIso);

    const horasTotalesCompletadas = this.round(horasPreviasCursadas + horasRegistradasEnApp);
    const horasRestantes = Math.max(0, this.round(metaHorasTotal - horasTotalesCompletadas));
    const porcentajeProgreso =
      metaHorasTotal > 0
        ? Math.min(100, Math.max(0, this.round((horasTotalesCompletadas / metaHorasTotal) * 100, 1)))
        : 0;

    const totalDiasTrabajados = diasUnicos.size;
    const promedioHorasPorDia =
      totalDiasTrabajados > 0 ? this.round(horasRegistradasEnApp / totalDiasTrabajados, 1) : 0;

    let estadoRitmo: EstadoRitmo = 'sin_fechas';
    let diferenciaHorasRitmo = 0;
    let horasEsperadasHoy = 0;
    let ritmoDiarioSugerido = 0;
    let diasHabilesRestantes = 0;
    let mensajeRitmo = 'Configura las fechas de tu convenio para calcular el ritmo de avance.';

    if (perfil.fechaInicio && perfil.fechaFin) {
      const calendario = this.calcularCalendarioHabiles(perfil, todayIso);
      const { totalDiasHabiles, diasHabilesCerrados, esHoyHabil, diasHabilesFuturos } = calendario;

      // Días hábiles disponibles futuros para cumplir las horas pendientes:
      // Si hoy ya se registraron horas (jornada ejecutada), las horas restantes corresponden a los días futuros.
      // Si hoy es hábil pero aún no se registran horas, hoy sigue disponible para aportar trabajo.
      if (todayIso > perfil.fechaFin) {
        diasHabilesRestantes = 0;
      } else if (todayIso < perfil.fechaInicio) {
        diasHabilesRestantes = totalDiasHabiles;
      } else {
        diasHabilesRestantes = (esHoyHabil && horasRegistradasHoy === 0 ? 1 : 0) + diasHabilesFuturos;
      }

      // Horas esperadas acumuladas:
      // Para evitar el "efecto yo-yo" intra-día: si hoy ya registró horas, evaluamos contra el cierre de hoy.
      // Si hoy aún no registra horas, evaluamos contra las horas esperadas al inicio del turno de hoy.
      const diasEvaluados =
        esHoyHabil && horasRegistradasHoy > 0 ? diasHabilesCerrados + 1 : diasHabilesCerrados;

      horasEsperadasHoy =
        totalDiasHabiles > 0
          ? this.round(metaHorasTotal * (diasEvaluados / totalDiasHabiles), 1)
          : 0;

      diferenciaHorasRitmo = this.round(horasTotalesCompletadas - horasEsperadasHoy, 1);

      if (horasRestantes <= 0) {
        estadoRitmo = 'adelantado';
        ritmoDiarioSugerido = 0;
        mensajeRitmo = '🎉 ¡Completaste el 100% de tus horas de prácticas!';
      } else if (todayIso > perfil.fechaFin || diasHabilesRestantes === 0) {
        estadoRitmo = 'vencido';
        ritmoDiarioSugerido = 0;
        mensajeRitmo = `📅 El periodo de prácticas finalizó con ${horasRestantes.toFixed(1)} hrs pendientes. Ajusta tu fecha de fin si acordaste una extensión.`;
      } else if (todayIso < perfil.fechaInicio) {
        estadoRitmo = 'a_tiempo';
        ritmoDiarioSugerido =
          totalDiasHabiles > 0 ? this.round(horasRestantes / totalDiasHabiles, 1) : 0;
        mensajeRitmo = `📅 Tu periodo de prácticas inicia el ${perfil.fechaInicio}. Ritmo previsto: ${ritmoDiarioSugerido.toFixed(1)} hrs/día.`;
      } else {
        ritmoDiarioSugerido =
          diasHabilesRestantes > 0
            ? this.round(horasRestantes / diasHabilesRestantes, 1)
            : horasRestantes;

        if (diferenciaHorasRitmo >= this.UMBRAL_TOLERANCIA_HORAS) {
          estadoRitmo = 'adelantado';
          mensajeRitmo = `🚀 Vas adelantado por +${diferenciaHorasRitmo.toFixed(1)} hrs. ¡Excelente ritmo!`;
        } else if (diferenciaHorasRitmo >= -this.UMBRAL_TOLERANCIA_HORAS) {
          estadoRitmo = 'a_tiempo';
          mensajeRitmo = '⏱️ Vas al día según tu planificación.';
        } else {
          estadoRitmo = 'atrasado';
          const atrasoAbs = Math.abs(diferenciaHorasRitmo).toFixed(1);
          if (ritmoDiarioSugerido > this.JORNADA_MAXIMA_HABITUAL) {
            mensajeRitmo = `⚠️ Llevas un retraso de ${atrasoAbs} hrs. Necesitas ${ritmoDiarioSugerido.toFixed(1)} hrs/día (excede la jornada habitual de 6h). Considera tramitar una extensión de fecha fin.`;
          } else {
            mensajeRitmo = `⚠️ Llevas un retraso de ${atrasoAbs} hrs. Necesitas ${ritmoDiarioSugerido.toFixed(1)} hrs/día.`;
          }
        }
      }
    }

    return {
      horasTotalesCompletadas,
      horasPreviasCursadas,
      horasRegistradasEnApp,
      metaHorasTotal,
      horasRestantes,
      porcentajeProgreso,
      horasEstaSemana,
      horasEsteMes,
      totalDiasTrabajados,
      promedioHorasPorDia,
      horasPorDiaSemana,
      estadoRitmo,
      diferenciaHorasRitmo,
      horasEsperadasHoy,
      ritmoDiarioSugerido,
      diasHabilesRestantes,
      mensajeRitmo,
    };
  }
}
