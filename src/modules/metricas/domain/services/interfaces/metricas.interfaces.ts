export interface SemanaPractica {
    numeroSemana: number;
    lunesIso: string;
    domingoIso: string;
    diasDisponibles: string[];
    metaSemana: number;
  }
  
export  interface HorasAgrupadas {
    horasRegistradasEnApp: number;
    horasRegistradasHoy: number;
    horasEstaSemana: number;
    horasEsteMes: number;
    diasUnicos: Set<string>;
    horasPorDiaSemana: Record<string, number>;
  }