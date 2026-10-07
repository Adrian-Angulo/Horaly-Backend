export type EstadoRitmo = 'adelantado' | 'a_tiempo' | 'atrasado' | 'vencido' | 'sin_fechas';

export interface MetricasDashboard {
  horasTotalesCompletadas: number;
  horasPreviasCursadas: number;
  horasRegistradasEnApp: number;
  metaHorasTotal: number;
  horasRestantes: number;
  porcentajeProgreso: number;
  horasEstaSemana: number;
  horasEsteMes: number;
  totalDiasTrabajados: number;
  promedioHorasPorDia: number;
  horasPorDiaSemana: Record<string, number>; // "1" (lunes) a "7" (domingo)
  estadoRitmo: EstadoRitmo;
  diferenciaHorasRitmo: number;
  horasEsperadasHoy: number;
  ritmoDiarioSugerido: number;
  diasHabilesRestantes: number;
  mensajeRitmo: string;
}
