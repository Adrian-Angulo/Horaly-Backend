"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacingEngineService = void 0;
const colombia_holidays_service_js_1 = require("./colombia-holidays.service.js");
class PacingEngineService {
    static UMBRAL_TOLERANCIA_HORAS = 2.0;
    static JORNADA_HABITUAL_HORAS = 4.0;
    static JORNADA_MAXIMA_LEGAL = 8.0;
    static round(val, decimals = 2) {
        const factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
    }
    static formatDateIso(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    static parseDateIso(dateIso) {
        const [y, m, d] = dateIso.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    static getDayKey(dayIndex) {
        // 0: Domingo, 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado
        const map = {
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
    static obtenerDiasActivosMap(perfil) {
        const activeDaysMap = {};
        let anyActive = false;
        if (perfil.horarioSemanal) {
            for (const [dayName, schedule] of Object.entries(perfil.horarioSemanal)) {
                if (schedule && schedule.activo) {
                    activeDaysMap[dayName.toLowerCase()] = true;
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
    /**
     * Divide el periodo [fechaInicio, fechaFin] en semanas naturales de lunes a domingo.
     * Filtra días activos según el horario semanal del perfil y excluye los festivos nacionales de Colombia.
     * Cada semana que posea al menos un día disponible mantiene la meta semanal completa (por defecto 20h).
     */
    static construirSemanasPracticas(perfil, festivosSet) {
        if (!perfil.fechaInicio || !perfil.fechaFin) {
            return [];
        }
        const startDate = this.parseDateIso(perfil.fechaInicio);
        const endDate = this.parseDateIso(perfil.fechaFin);
        if (startDate > endDate) {
            return [];
        }
        const activeDaysMap = this.obtenerDiasActivosMap(perfil);
        const metaMinimaSemanal = perfil.horasMinimasSemanales ?? 20.0;
        // Alinear al lunes de la semana que contiene startDate
        const currentStart = new Date(startDate);
        const dayOfWeek = currentStart.getDay();
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
        currentStart.setDate(currentStart.getDate() + diffToMonday);
        const semanas = [];
        let weekIndex = 1;
        while (currentStart <= endDate) {
            const lunesIso = this.formatDateIso(currentStart);
            const domingo = new Date(currentStart);
            domingo.setDate(domingo.getDate() + 6);
            const domingoIso = this.formatDateIso(domingo);
            const diasDisponibles = [];
            // Evaluar los 7 días de la semana
            const tempDay = new Date(currentStart);
            for (let i = 0; i < 7; i++) {
                const tempIso = this.formatDateIso(tempDay);
                // 1. Debe estar dentro del rango [fechaInicio, fechaFin]
                if (tempIso >= perfil.fechaInicio && tempIso <= perfil.fechaFin) {
                    const dayName = this.getDayKey(tempDay.getDay());
                    const esDiaActivo = !!activeDaysMap[dayName];
                    const esFestivo = festivosSet.has(tempIso);
                    // 2. Debe ser día activo en horario y NO ser festivo
                    if (esDiaActivo && !esFestivo) {
                        diasDisponibles.push(tempIso);
                    }
                }
                tempDay.setDate(tempDay.getDate() + 1);
            }
            // Regla de Negocio: Un festivo no reduce la meta semanal de 20h.
            // Si la semana tiene al menos un día disponible, mantiene la meta semanal de 20h
            // (a recuperar en los días restantes). Si no tiene días disponibles, la meta es 0.
            const metaSemana = diasDisponibles.length > 0 ? metaMinimaSemanal : 0;
            semanas.push({
                numeroSemana: weekIndex++,
                lunesIso,
                domingoIso,
                diasDisponibles,
                metaSemana,
            });
            // Avanzar al siguiente lunes
            currentStart.setDate(currentStart.getDate() + 7);
        }
        return semanas;
    }
    /**
     * Calcula las horas esperadas acumuladas a la fecha `todayIso`.
     * - Semanas pasadas: aportan el 100% de su meta.
     * - Semana en curso: prorrateo proporcional según los días disponibles transcurridos.
     * - Semanas futuras: 0 horas.
     */
    static calcularHorasEsperadasAcumuladas(semanas, todayIso, horasRegistradasHoy, metaHorasTotal) {
        let horasAcumuladas = 0;
        let totalDiasDisponibles = 0;
        for (const sem of semanas) {
            totalDiasDisponibles += sem.diasDisponibles.length;
            if (todayIso > sem.domingoIso) {
                // Semana completamente transcurrida en el pasado
                horasAcumuladas += sem.metaSemana;
            }
            else if (todayIso >= sem.lunesIso && todayIso <= sem.domingoIso) {
                // Semana en curso
                if (sem.diasDisponibles.length > 0) {
                    // Si hoy ya se registraron horas, hoy cuenta como transcurrido/evaluado.
                    // Si hoy no se han registrado horas, solo cuentan los días anteriores a hoy.
                    const diasTranscurridos = sem.diasDisponibles.filter((d) => (horasRegistradasHoy > 0 ? d <= todayIso : d < todayIso)).length;
                    const proporcion = diasTranscurridos / sem.diasDisponibles.length;
                    horasAcumuladas += sem.metaSemana * proporcion;
                }
            }
            // Semanas futuras no aportan horas esperadas
        }
        // No exceder la meta total configurada
        const horasEsperadas = Math.min(metaHorasTotal, this.round(horasAcumuladas, 1));
        return {
            horasEsperadasHoy: horasEsperadas,
            totalDiasDisponibles,
        };
    }
    /**
     * Calcula los días disponibles restantes para trabajar hasta la fecha de finalización.
     */
    static calcularDiasDisponiblesRestantes(semanas, todayIso, horasRegistradasHoy, fechaInicio, fechaFin) {
        if (todayIso > fechaFin) {
            return 0;
        }
        let restantes = 0;
        for (const sem of semanas) {
            for (const diaIso of sem.diasDisponibles) {
                if (todayIso < fechaInicio) {
                    // Periodo no iniciado: todos los días cuentan
                    restantes++;
                }
                else if (diaIso > todayIso) {
                    // Días futuros del periodo
                    restantes++;
                }
                else if (diaIso === todayIso) {
                    // El día de hoy: cuenta como restante SOLO si aún no se han registrado horas
                    if (horasRegistradasHoy === 0) {
                        restantes++;
                    }
                }
            }
        }
        return restantes;
    }
    static calcularHorasRegistradas(registros, now, todayIso) {
        let horasRegistradasEnApp = 0;
        let horasRegistradasHoy = 0;
        let horasEstaSemana = 0;
        let horasEsteMes = 0;
        const diasUnicos = new Set();
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
        const horasPorDiaSemana = {
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
            const regDate = new Date(y, m - 1, d);
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
    /**
     * Método principal para el cálculo del ritmo y proyecciones del dashboard.
     */
    static calcularMetricas(perfil, registros, now = new Date()) {
        const metaHorasTotal = perfil.metaHorasTotal || 320.0;
        const horasPreviasCursadas = perfil.horasInicialesPrevias || 0;
        const todayIso = this.formatDateIso(now);
        const { horasRegistradasEnApp, horasRegistradasHoy, horasEstaSemana, horasEsteMes, diasUnicos, horasPorDiaSemana, } = this.calcularHorasRegistradas(registros, now, todayIso);
        const horasTotalesCompletadas = this.round(horasPreviasCursadas + horasRegistradasEnApp);
        const horasRestantes = Math.max(0, this.round(metaHorasTotal - horasTotalesCompletadas));
        const porcentajeProgreso = metaHorasTotal > 0
            ? Math.min(100, Math.max(0, this.round((horasTotalesCompletadas / metaHorasTotal) * 100, 1)))
            : 0;
        const totalDiasTrabajados = diasUnicos.size;
        const promedioHorasPorDia = totalDiasTrabajados > 0 ? this.round(horasRegistradasEnApp / totalDiasTrabajados, 1) : 0;
        let estadoRitmo = 'sin_fechas';
        let diferenciaHorasRitmo = 0;
        let horasEsperadasHoy = 0;
        let ritmoDiarioSugerido = 0;
        let diasHabilesRestantes = 0;
        let mensajeRitmo = 'Configura las fechas de tu convenio para calcular el ritmo de avance.';
        if (perfil.fechaInicio && perfil.fechaFin) {
            const festivosSet = colombia_holidays_service_js_1.ColombiaHolidaysService.obtenerFestivosEnRango(perfil.fechaInicio, perfil.fechaFin);
            const semanas = this.construirSemanasPracticas(perfil, festivosSet);
            const resultadoEsperadas = this.calcularHorasEsperadasAcumuladas(semanas, todayIso, horasRegistradasHoy, metaHorasTotal);
            horasEsperadasHoy = resultadoEsperadas.horasEsperadasHoy;
            diasHabilesRestantes = this.calcularDiasDisponiblesRestantes(semanas, todayIso, horasRegistradasHoy, perfil.fechaInicio, perfil.fechaFin);
            diferenciaHorasRitmo = this.round(horasTotalesCompletadas - horasEsperadasHoy, 1);
            // Evaluación del Estado y Mensajes
            if (todayIso > perfil.fechaFin && horasRestantes > 0) {
                // Finalizó el periodo pero aún faltan horas
                estadoRitmo = 'vencido';
                ritmoDiarioSugerido = 0;
                mensajeRitmo = `📅 El periodo de prácticas finalizó con ${horasRestantes.toFixed(1)} hrs pendientes. Tramita una extensión de fecha fin.`;
            }
            else if (todayIso < perfil.fechaInicio) {
                // Periodo aún no inicia
                estadoRitmo = 'a_tiempo';
                ritmoDiarioSugerido =
                    diasHabilesRestantes > 0 ? this.round(horasRestantes / diasHabilesRestantes, 1) : 0;
                mensajeRitmo = `📅 Tu periodo de prácticas inicia el ${perfil.fechaInicio}. Ritmo previsto: ${ritmoDiarioSugerido.toFixed(1)} hrs/día.`;
            }
            else if (horasRestantes <= 0) {
                // Horas completadas en su totalidad
                if (diferenciaHorasRitmo >= this.UMBRAL_TOLERANCIA_HORAS) {
                    estadoRitmo = 'adelantado';
                }
                else {
                    estadoRitmo = 'a_tiempo';
                }
                ritmoDiarioSugerido = 0;
                mensajeRitmo = '🎉 ¡Completaste el 100% de tus horas de prácticas!';
            }
            else if (diasHabilesRestantes === 0 && horasRestantes > 0) {
                // Se agotaron los días hábiles disponibles
                estadoRitmo = 'vencido';
                ritmoDiarioSugerido = 0;
                mensajeRitmo = `📅 Ya no quedan días disponibles en tu calendario y restan ${horasRestantes.toFixed(1)} hrs. Tramita una extensión.`;
            }
            else {
                // Periodo activo con horas y días pendientes
                ritmoDiarioSugerido =
                    diasHabilesRestantes > 0
                        ? this.round(horasRestantes / diasHabilesRestantes, 1)
                        : horasRestantes;
                if (diferenciaHorasRitmo >= this.UMBRAL_TOLERANCIA_HORAS) {
                    estadoRitmo = 'adelantado';
                    mensajeRitmo = `🚀 Vas adelantado por +${diferenciaHorasRitmo.toFixed(1)} hrs. ¡Excelente ritmo!`;
                }
                else if (diferenciaHorasRitmo >= -this.UMBRAL_TOLERANCIA_HORAS) {
                    estadoRitmo = 'a_tiempo';
                    const signo = diferenciaHorasRitmo >= 0 ? '+' : '';
                    if (ritmoDiarioSugerido > this.JORNADA_MAXIMA_LEGAL) {
                        mensajeRitmo = `⏱️ Vas al día (${signo}${diferenciaHorasRitmo.toFixed(1)} hrs), pero el ritmo proyectado de ${ritmoDiarioSugerido.toFixed(1)} hrs/día excede la jornada máxima legal de 8h. Requiere extensión de convenio.`;
                    }
                    else {
                        mensajeRitmo = `⏱️ Vas al día según tu planificación (${signo}${diferenciaHorasRitmo.toFixed(1)} hrs).`;
                    }
                }
                else {
                    estadoRitmo = 'atrasado';
                    const atrasoAbs = Math.abs(diferenciaHorasRitmo).toFixed(1);
                    if (ritmoDiarioSugerido > this.JORNADA_MAXIMA_LEGAL) {
                        mensajeRitmo = `⚠️ Llevas un retraso de ${atrasoAbs} hrs. Necesitas ${ritmoDiarioSugerido.toFixed(1)} hrs/día (excede la jornada máxima legal de 8h). Requiere extensión de convenio.`;
                    }
                    else if (ritmoDiarioSugerido > this.JORNADA_HABITUAL_HORAS) {
                        mensajeRitmo = `⚠️ Llevas un retraso de ${atrasoAbs} hrs. Necesitas ${ritmoDiarioSugerido.toFixed(1)} hrs/día (excede la jornada habitual de 4h).`;
                    }
                    else {
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
exports.PacingEngineService = PacingEngineService;
//# sourceMappingURL=pacing-engine.service.js.map