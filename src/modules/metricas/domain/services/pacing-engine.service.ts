import { Perfil } from '../../../profile/domain/entities/profile.entity.js';
import { RegistroHora } from '../../../registros/domain/entities/registro-hora.entity.js';
import { EstadoRitmo, MetricasDashboard } from '../entities/metricas-dashboard.entity.js';
import { ColombiaHolidaysService } from './colombia-holidays.service.js';
import { HorasAgrupadas, SemanaPractica } from './interfaces/metricas.interfaces.js';
import { calcularHorasRegistradas, estaEnMismoMes, estaEnRangoSemana, formatDateIso, getDayKey, obtenerDayKey, obtenerRegDate, parseDateIso, round } from './utils/metricas.utils.js';

// Interfaces separadas a su propio archivo si es posible para reducir longitud

export class PacingEngineService {
  public static readonly UMBRAL_TOLERANCIA_HORAS = 2.0;
  public static readonly JORNADA_HABITUAL_HORAS = 4.0;
  public static readonly JORNADA_MAXIMA_LEGAL = 8.0;



  private static obtenerDiasActivosMap(perfil: Perfil): Record<string, boolean> {
    const activeDaysMap: Record<string, boolean> = {};
    let anyActive = false;
    if (perfil.horarioSemanal) {
      for (const [dayName, schedule] of Object.entries(perfil.horarioSemanal)) {
        if (schedule?.activo) {
          activeDaysMap[dayName.toLowerCase()] = true;
          anyActive = true;
        }
      }
    }
    if (!anyActive) {
      ['lunes','martes','miercoles','jueves','viernes'].forEach(d => activeDaysMap[d]=true);
    }
    return activeDaysMap;
  }

  public static construirSemanasPracticas(
    perfil: Perfil,
    festivosSet: Set<string>
  ): SemanaPractica[] {
    if (!perfil.fechaInicio || !perfil.fechaFin) return [];

    const startDate = parseDateIso(perfil.fechaInicio);
    const endDate = parseDateIso(perfil.fechaFin);
    if (startDate > endDate) return [];

    const activeDaysMap = this.obtenerDiasActivosMap(perfil);
    const metaMinimaSemanal = perfil.horasMinimasSemanales ?? 20.0;

    // Alinear la fecha al lunes de la semana correspondiente
    const currentStart = new Date(startDate);
    const diffToMonday = (currentStart.getDay() === 0 ? -6 : 1) - currentStart.getDay();
    currentStart.setDate(currentStart.getDate() + diffToMonday);

    const semanas: SemanaPractica[] = [];
    let weekIndex = 1;

    // Splitter de periodo en semanas
    while (currentStart <= endDate) {
      const lunesIso = formatDateIso(currentStart);
      const domingo = new Date(currentStart);
      domingo.setDate(domingo.getDate() + 6);
      const domingoIso = formatDateIso(domingo);

      const diasDisponibles: string[] = this.obtenerDiasDisponiblesDeSemana(
        currentStart, perfil, activeDaysMap, festivosSet
      );

      const metaSemana = diasDisponibles.length > 0 ? metaMinimaSemanal : 0;

      semanas.push({
        numeroSemana: weekIndex++,
        lunesIso,
        domingoIso,
        diasDisponibles,
        metaSemana,
      });
      // Avanza al siguiente lunes
      currentStart.setDate(currentStart.getDate() + 7);
    }
    return semanas;
  }


  private static obtenerDiasDisponiblesDeSemana(
    weekStart: Date,
    perfil: Perfil,
    activeDaysMap: Record<string, boolean>,
    festivosSet: Set<string>,
  ): string[] {
    const dias: string[] = [];
    const tempDay = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const tempIso = formatDateIso(tempDay);
      if (perfil.fechaInicio && perfil.fechaFin && tempIso >= perfil.fechaInicio && tempIso <= perfil.fechaFin) {
        const dayName = getDayKey(tempDay.getDay());
        const esDiaActivo = !!activeDaysMap[dayName];
        const esFestivo = festivosSet.has(tempIso);
        if (esDiaActivo && !esFestivo) dias.push(tempIso);
      }
 
      tempDay.setDate(tempDay.getDate() + 1);
    }
    return dias;
  }

  public static calcularHorasEsperadasAcumuladas(
    semanas: SemanaPractica[],
    todayIso: string,
    horasRegistradasHoy: number,
    metaHorasTotal: number
  ): { horasEsperadasHoy: number; totalDiasDisponibles: number } {
    let horasAcumuladas = 0;
    let totalDiasDisponibles = 0;
    for (const sem of semanas) {
      totalDiasDisponibles += sem.diasDisponibles.length;
      if (todayIso > sem.domingoIso) {
        horasAcumuladas += sem.metaSemana;
      } else if (todayIso >= sem.lunesIso && todayIso <= sem.domingoIso) {
        if (sem.diasDisponibles.length > 0) {
          const diasTranscurridos = sem.diasDisponibles.filter(
            (d) => (horasRegistradasHoy > 0 ? d <= todayIso : d < todayIso)
          ).length;
          const proporcion = diasTranscurridos / sem.diasDisponibles.length;
          horasAcumuladas += sem.metaSemana * proporcion;
        }
      }
      // Semanas futuras = 0
    }
    const horasEsperadas = Math.min(metaHorasTotal, round(horasAcumuladas, 1));
    return { horasEsperadasHoy: horasEsperadas, totalDiasDisponibles };
  }

  public static calcularDiasDisponiblesRestantes(
    semanas: SemanaPractica[],
    todayIso: string,
    horasRegistradasHoy: number,
    fechaInicio: string,
    fechaFin: string
  ): number {
    if (todayIso > fechaFin) return 0;
    let restantes = 0;
    for (const sem of semanas) {
      for (const diaIso of sem.diasDisponibles) {
        if (todayIso < fechaInicio) {
          restantes++;
        } else if (diaIso > todayIso) {
          restantes++;
        } else if (diaIso === todayIso && horasRegistradasHoy === 0) {
          restantes++;
        }
      }
    }
    return restantes;
  }

 

  public static calcularMetricas(
    perfil: Perfil,
    registros: RegistroHora[],
    now: Date = new Date()
  ): MetricasDashboard {
    const metaHorasTotal = perfil.metaHorasTotal || 320.0;
    const horasPreviasCursadas = perfil.horasInicialesPrevias || 0;
    const todayIso = formatDateIso(now);

    // Cálculo agrupado modularizado
    const horasData = calcularHorasRegistradas(registros, now, todayIso);

    const horasTotalesCompletadas = round(horasPreviasCursadas + horasData.horasRegistradasEnApp);
    const horasRestantes = Math.max(0, round(metaHorasTotal - horasTotalesCompletadas));
    const porcentajeProgreso =
      metaHorasTotal > 0
        ? Math.min(100, Math.max(0, round((horasTotalesCompletadas / metaHorasTotal) * 100, 1)))
        : 0;

    const totalDiasTrabajados = horasData.diasUnicos.size;
    const promedioHorasPorDia = totalDiasTrabajados > 0
        ? round(horasData.horasRegistradasEnApp / totalDiasTrabajados, 1)
        : 0;

    let estadoRitmo: EstadoRitmo = 'sin_fechas';
    let diferenciaHorasRitmo = 0, horasEsperadasHoy = 0;
    let ritmoDiarioSugerido = 0, diasHabilesRestantes = 0;
    let mensajeRitmo = 'Configura las fechas de tu convenio para calcular el ritmo de avance.';

    if (perfil.fechaInicio && perfil.fechaFin) {
      const festivosSet = ColombiaHolidaysService.obtenerFestivosEnRango(
        perfil.fechaInicio,
        perfil.fechaFin
      );
      const semanas = this.construirSemanasPracticas(perfil, festivosSet);

      const resultadoEsperadas = this.calcularHorasEsperadasAcumuladas(
        semanas,
        todayIso,
        horasData.horasRegistradasHoy,
        metaHorasTotal
      );
      horasEsperadasHoy = resultadoEsperadas.horasEsperadasHoy;

      diasHabilesRestantes = this.calcularDiasDisponiblesRestantes(
        semanas, todayIso, horasData.horasRegistradasHoy, perfil.fechaInicio, perfil.fechaFin
      );

      diferenciaHorasRitmo = round(horasTotalesCompletadas - horasEsperadasHoy, 1);

      // Single-responsibility: Considera mover cada if a helpers privados:
      if (todayIso > perfil.fechaFin && horasRestantes > 0) {
        estadoRitmo = 'vencido';
        mensajeRitmo = `📅 El periodo de prácticas finalizó con ${horasRestantes.toFixed(1)} hrs pendientes. Tramita una extensión de fecha fin.`;
      } else if (todayIso < perfil.fechaInicio) {
        estadoRitmo = 'a_tiempo';
        ritmoDiarioSugerido = diasHabilesRestantes > 0
            ? round(horasRestantes / diasHabilesRestantes, 1)
            : 0;
        mensajeRitmo = `📅 Tu periodo de prácticas inicia el ${perfil.fechaInicio}. Ritmo previsto: ${ritmoDiarioSugerido.toFixed(1)} hrs/día.`;
      } else if (horasRestantes <= 0) {
        estadoRitmo = diferenciaHorasRitmo >= this.UMBRAL_TOLERANCIA_HORAS ? 'adelantado' : 'a_tiempo';
        mensajeRitmo = '🎉 ¡Completaste el 100% de tus horas de prácticas!';
      } else if (diasHabilesRestantes === 0 && horasRestantes > 0) {
        estadoRitmo = 'vencido';
        mensajeRitmo = `📅 Ya no quedan días disponibles en tu calendario y restan ${horasRestantes.toFixed(1)} hrs. Tramita una extensión.`;
      } else {
        // Estado activo - extraer reglas de mensajes a otro método si crece
        ritmoDiarioSugerido = diasHabilesRestantes > 0
            ? round(horasRestantes / diasHabilesRestantes, 1)
            : horasRestantes;
        if (diferenciaHorasRitmo >= this.UMBRAL_TOLERANCIA_HORAS) {
          estadoRitmo = 'adelantado';
          mensajeRitmo = `🚀 Vas adelantado por +${diferenciaHorasRitmo.toFixed(1)} hrs. ¡Excelente ritmo!`;
        } else if (diferenciaHorasRitmo >= -this.UMBRAL_TOLERANCIA_HORAS) {
          estadoRitmo = 'a_tiempo';
          const signo = diferenciaHorasRitmo >= 0 ? '+' : '';
          if (ritmoDiarioSugerido > this.JORNADA_MAXIMA_LEGAL) {
            mensajeRitmo = `⏱️ Vas al día (${signo}${diferenciaHorasRitmo.toFixed(1)} hrs), pero el ritmo proyectado de ${ritmoDiarioSugerido.toFixed(1)} hrs/día excede la jornada máxima legal de 8h. Requiere extensión de convenio.`;
          } else {
            mensajeRitmo = `⏱️ Vas al día según tu planificación (${signo}${diferenciaHorasRitmo.toFixed(1)} hrs).`;
          }
        } else {
          estadoRitmo = 'atrasado';
          const atrasoAbs = Math.abs(diferenciaHorasRitmo).toFixed(1);
          if (ritmoDiarioSugerido > this.JORNADA_MAXIMA_LEGAL) {
            mensajeRitmo = `⚠️ Llevas un retraso de ${atrasoAbs} hrs. Necesitas ${ritmoDiarioSugerido.toFixed(1)} hrs/día (excede la jornada máxima legal de 8h). Requiere extensión de convenio.`;
          } else if (ritmoDiarioSugerido > this.JORNADA_HABITUAL_HORAS) {
            mensajeRitmo = `⚠️ Llevas un retraso de ${atrasoAbs} hrs. Necesitas ${ritmoDiarioSugerido.toFixed(1)} hrs/día (excede la jornada habitual de 4h).`;
          } else {
            mensajeRitmo = `⚠️ Llevas un retraso de ${atrasoAbs} hrs. Necesitas ${ritmoDiarioSugerido.toFixed(1)} hrs/día.`;
          }
        }
      }
    }

    return {
      horasTotalesCompletadas,
      horasPreviasCursadas,
      horasRegistradasEnApp: horasData.horasRegistradasEnApp,
      metaHorasTotal,
      horasRestantes,
      porcentajeProgreso,
      horasEstaSemana: horasData.horasEstaSemana,
      horasEsteMes: horasData.horasEsteMes,
      totalDiasTrabajados,
      promedioHorasPorDia,
      horasPorDiaSemana: horasData.horasPorDiaSemana,
      estadoRitmo,
      diferenciaHorasRitmo,
      horasEsperadasHoy,
      ritmoDiarioSugerido,
      diasHabilesRestantes,
      mensajeRitmo,
    };
  }
}

