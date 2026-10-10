import { Perfil } from '../../../profile/domain/entities/profile.entity.js';
import { RegistroHora } from '../../../registros/domain/entities/registro-hora.entity.js';
import { MetricasDashboard } from '../entities/metricas-dashboard.entity.js';
export declare class PacingEngineService {
    private static readonly UMBRAL_TOLERANCIA_HORAS;
    private static readonly JORNADA_MAXIMA_HABITUAL;
    private static round;
    private static formatDateIso;
    private static getDayKey;
    private static obtenerDiasActivosMap;
    private static calcularCalendarioHabiles;
    private static calcularHorasRegistradas;
    static calcularMetricas(perfil: Perfil, registros: RegistroHora[], now?: Date): MetricasDashboard;
}
