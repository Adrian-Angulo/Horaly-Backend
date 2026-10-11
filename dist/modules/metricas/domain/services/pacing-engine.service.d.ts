import { Perfil } from '../../../profile/domain/entities/profile.entity.js';
import { RegistroHora } from '../../../registros/domain/entities/registro-hora.entity.js';
import { MetricasDashboard } from '../entities/metricas-dashboard.entity.js';
import { SemanaPractica } from './interfaces/metricas.interfaces.js';
export declare class PacingEngineService {
    static readonly UMBRAL_TOLERANCIA_HORAS = 2;
    static readonly JORNADA_HABITUAL_HORAS = 4;
    static readonly JORNADA_MAXIMA_LEGAL = 8;
    private static obtenerDiasActivosMap;
    static construirSemanasPracticas(perfil: Perfil, festivosSet: Set<string>): SemanaPractica[];
    private static obtenerDiasDisponiblesDeSemana;
    static calcularHorasEsperadasAcumuladas(semanas: SemanaPractica[], todayIso: string, horasRegistradasHoy: number, metaHorasTotal: number): {
        horasEsperadasHoy: number;
        totalDiasDisponibles: number;
    };
    static calcularDiasDisponiblesRestantes(semanas: SemanaPractica[], todayIso: string, horasRegistradasHoy: number, fechaInicio: string, fechaFin: string): number;
    static calcularMetricas(perfil: Perfil, registros: RegistroHora[], now?: Date): MetricasDashboard;
}
