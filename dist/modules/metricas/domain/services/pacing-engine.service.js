"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacingEngineService = void 0;
class PacingEngineService {
    static round(val, decimals = 2) {
        const factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
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
    static calcularMetricas(perfil, registros, now = new Date()) {
        const metaHorasTotal = perfil.metaHorasTotal || 360;
        const horasPreviasCursadas = perfil.horasInicialesPrevias || 0;
        // 1. Horas registradas en la app
        let horasRegistradasEnApp = 0;
        const diasUnicos = new Set();
        // Fechas límites de la semana actual (Lunes a Domingo)
        const currentDay = now.getDay();
        const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
        const monday = new Date(now);
        monday.setDate(now.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        let horasEstaSemana = 0;
        let horasEsteMes = 0;
        // Inicializar desglose por día de la semana (1 = Lunes a 7 = Domingo)
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
            // Fecha del registro
            const [y, m, d] = reg.fecha.split('-').map(Number);
            const regDate = new Date(y, m - 1, d);
            // Horas del mes actual
            if (regDate.getFullYear() === currentYear && regDate.getMonth() === currentMonth) {
                horasEsteMes += horas;
            }
            // Horas de la semana actual
            if (regDate >= monday && regDate <= sunday) {
                horasEstaSemana += horas;
                const dayOfWeek = regDate.getDay(); // 0 = Domingo, 1 = Lunes ...
                const dayKey = dayOfWeek === 0 ? '7' : dayOfWeek.toString();
                horasPorDiaSemana[dayKey] = (horasPorDiaSemana[dayKey] || 0) + horas;
            }
        }
        horasRegistradasEnApp = this.round(horasRegistradasEnApp);
        horasEstaSemana = this.round(horasEstaSemana);
        horasEsteMes = this.round(horasEsteMes);
        for (const k of Object.keys(horasPorDiaSemana)) {
            horasPorDiaSemana[k] = this.round(horasPorDiaSemana[k] || 0);
        }
        const horasTotalesCompletadas = this.round(horasPreviasCursadas + horasRegistradasEnApp);
        const horasRestantes = Math.max(0, this.round(metaHorasTotal - horasTotalesCompletadas));
        const porcentajeProgreso = metaHorasTotal > 0
            ? Math.min(100, Math.max(0, this.round((horasTotalesCompletadas / metaHorasTotal) * 100, 1)))
            : 0;
        const totalDiasTrabajados = diasUnicos.size;
        const promedioHorasPorDia = totalDiasTrabajados > 0 ? this.round(horasRegistradasEnApp / totalDiasTrabajados, 1) : 0;
        // 2. Motor de Ritmo (Pacing Engine)
        let totalDiasHabiles = 0;
        let diasHabilesTranscurridos = 0;
        let diasHabilesRestantes = 0;
        let estadoRitmo = 'sin_fechas';
        let diferenciaHorasRitmo = 0;
        let horasEsperadasHoy = 0;
        let ritmoDiarioSugerido = 0;
        let mensajeRitmo = 'Configura las fechas de tu convenio para calcular el ritmo de avance.';
        if (perfil.fechaInicio && perfil.fechaFin) {
            const [startYear, startMonth, startDay] = perfil.fechaInicio.split('-').map(Number);
            const [endYear, endMonth, endDay] = perfil.fechaFin.split('-').map(Number);
            const startDate = new Date(startYear, startMonth - 1, startDay);
            const endDate = new Date(endYear, endMonth - 1, endDay);
            const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
            // Configuración de días activos del horario semanal
            const activeDaysMap = {};
            let anyActive = false;
            if (perfil.horarioSemanal) {
                for (const [dayName, schedule] of Object.entries(perfil.horarioSemanal)) {
                    if (schedule && schedule.activo) {
                        activeDaysMap[dayName] = true;
                        anyActive = true;
                    }
                }
            }
            // Si ningún día está configurado activo, asumir Lunes a Viernes
            if (!anyActive) {
                activeDaysMap['lunes'] = true;
                activeDaysMap['martes'] = true;
                activeDaysMap['miercoles'] = true;
                activeDaysMap['jueves'] = true;
                activeDaysMap['viernes'] = true;
            }
            let diasHabilesCerrados = 0;
            let esHoyHabil = false;
            let diasHabilesFuturos = 0;
            // Iterar día a día
            const curr = new Date(startDate);
            while (curr <= endDate) {
                const dayOfWeek = curr.getDay();
                const dayKey = this.getDayKey(dayOfWeek);
                if (activeDaysMap[dayKey]) {
                    totalDiasHabiles++;
                    const dateIso = `${curr.getFullYear()}-${(curr.getMonth() + 1).toString().padStart(2, '0')}-${curr.getDate().toString().padStart(2, '0')}`;
                    if (dateIso < todayStr) {
                        diasHabilesCerrados++;
                    }
                    else if (dateIso === todayStr) {
                        esHoyHabil = true;
                    }
                    else {
                        diasHabilesFuturos++;
                    }
                }
                curr.setDate(curr.getDate() + 1);
            }
            diasHabilesTranscurridos = diasHabilesCerrados + (esHoyHabil ? 1 : 0);
            diasHabilesRestantes = (esHoyHabil ? 1 : 0) + diasHabilesFuturos;
            // Meta efectiva a computar dentro del periodo del calendario
            const metaEfectivaPeriodo = Math.max(0, metaHorasTotal - horasPreviasCursadas);
            // Horas esperadas al inicio del turno de hoy (sin sesgo matutino del día en curso)
            horasEsperadasHoy =
                totalDiasHabiles > 0
                    ? this.round(metaEfectivaPeriodo * (diasHabilesCerrados / totalDiasHabiles), 1)
                    : 0;
            // Diferencia respecto a lo registrado dentro de la app en este periodo
            diferenciaHorasRitmo = this.round(horasRegistradasEnApp - horasEsperadasHoy, 1);
            // Determinación de estado analítico
            if (horasRestantes <= 0) {
                estadoRitmo = 'adelantado';
                ritmoDiarioSugerido = 0;
                mensajeRitmo = '🎉 ¡Completaste el 100% de tus horas de prácticas!';
            }
            else if (diasHabilesRestantes === 0) {
                estadoRitmo = 'vencido';
                ritmoDiarioSugerido = 0;
                mensajeRitmo = `📅 El periodo de prácticas finalizó con ${horasRestantes.toFixed(1)} hrs pendientes. Ajusta tu fecha de fin si acordaste una extensión.`;
            }
            else {
                ritmoDiarioSugerido = this.round(horasRestantes / diasHabilesRestantes, 1);
                if (diferenciaHorasRitmo >= 3.0) {
                    estadoRitmo = 'adelantado';
                    mensajeRitmo = `🚀 Vas adelantado por +${diferenciaHorasRitmo.toFixed(1)} hrs. ¡Excelente ritmo!`;
                }
                else if (diferenciaHorasRitmo >= -3.0) {
                    estadoRitmo = 'a_tiempo';
                    mensajeRitmo = '⏱️ Vas al día según tu planificación.';
                }
                else {
                    estadoRitmo = 'atrasado';
                    mensajeRitmo = `⚠️ Llevas un retraso de ${Math.abs(diferenciaHorasRitmo).toFixed(1)} hrs. Necesitas ${ritmoDiarioSugerido.toFixed(1)} hrs/día.`;
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