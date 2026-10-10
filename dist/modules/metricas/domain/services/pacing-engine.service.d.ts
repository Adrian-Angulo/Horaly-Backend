import { Perfil } from '../../../profile/domain/entities/profile.entity.js';
import { RegistroHora } from '../../../registros/domain/entities/registro-hora.entity.js';
import { MetricasDashboard } from '../entities/metricas-dashboard.entity.js';
interface SemanaPractica {
    numeroSemana: number;
    lunesIso: string;
    domingoIso: string;
    diasDisponibles: string[];
    metaSemana: number;
}
export declare class PacingEngineService {
    static readonly UMBRAL_TOLERANCIA_HORAS = 2;
    static readonly JORNADA_HABITUAL_HORAS = 4;
    static readonly JORNADA_MAXIMA_LEGAL = 8;
    private static round;
    private static formatDateIso;
    private static parseDateIso;
    private static getDayKey;
    private static obtenerDiasActivosMap;
    /**
     * Divide el periodo [fechaInicio, fechaFin] en semanas naturales de lunes a domingo.
     * Filtra días activos según el horario semanal del perfil y excluye los festivos nacionales de Colombia.
     * Cada semana que posea al menos un día disponible mantiene la meta semanal completa (por defecto 20h).
     */
    static construirSemanasPracticas(perfil: Perfil, festivosSet: Set<string>): SemanaPractica[];
    /**
     * Calcula las horas esperadas acumuladas a la fecha `todayIso`.
     * - Semanas pasadas: aportan el 100% de su meta.
     * - Semana en curso: prorrateo proporcional según los días disponibles transcurridos.
     * - Semanas futuras: 0 horas.
     */
    static calcularHorasEsperadasAcumuladas(semanas: SemanaPractica[], todayIso: string, horasRegistradasHoy: number, metaHorasTotal: number): {
        horasEsperadasHoy: number;
        totalDiasDisponibles: number;
    };
    /**
     * Calcula los días disponibles restantes para trabajar hasta la fecha de finalización.
     */
    static calcularDiasDisponiblesRestantes(semanas: SemanaPractica[], todayIso: string, horasRegistradasHoy: number, fechaInicio: string, fechaFin: string): number;
    private static calcularHorasRegistradas;
    /**
     * Método principal para el cálculo del ritmo y proyecciones del dashboard.
     */
    static calcularMetricas(perfil: Perfil, registros: RegistroHora[], now?: Date): MetricasDashboard;
}
export {};
