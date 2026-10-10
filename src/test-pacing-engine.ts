import { PacingEngineService } from './modules/metricas/domain/services/pacing-engine.service.js';
import { ColombiaHolidaysService } from './modules/metricas/domain/services/colombia-holidays.service.js';
import { Perfil, defaultHorarioSemanal } from './modules/profile/domain/entities/profile.entity.js';
import { RegistroHora } from './modules/registros/domain/entities/registro-hora.entity.js';

console.log('==================================================================');
console.log('🧪 [TEST SUITE]: Pruebas Unitarias Exhaustivas de PacingEngineService');
console.log('==================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName} ${detail ? `-> [Detalle: ${detail}]` : ''}`);
  }
}

// Perfil base de prueba según las reglas de negocio
// 2026-08-04 (martes) a 2026-11-20 (viernes), meta 320h, 20h/semana
const perfilBase: Perfil = {
  id: 'user-pacing-test',
  email: 'practicante@colombia.edu.co',
  nombre: 'Carlos Rodríguez',
  metaHorasTotal: 320.0,
  horasInicialesPrevias: 0.0,
  horasMinimasSemanales: 20.0,
  perfilCompletado: true,
  fechaInicio: '2026-08-04',
  fechaFin: '2026-11-20',
  horarioSemanal: defaultHorarioSemanal,
};

// =============================================================================
// VERIFICACIÓN PREVIA: ColombiaHolidaysService
// =============================================================================
console.log('--- 1. Verificación de Festivos Oficiales de Colombia 2026 ---');
const festivos2026 = ColombiaHolidaysService.obtenerFestivosPorAnio(2026);
assert(festivos2026.has('2026-08-07'), '7 de Agosto (Batalla de Boyacá) es festivo');
assert(festivos2026.has('2026-08-17'), '17 de Agosto (Asunción trasladada Emiliani) es festivo');
assert(festivos2026.has('2026-10-12'), '12 de Octubre (Día de la Raza) es festivo');
assert(festivos2026.has('2026-11-02'), '2 de Noviembre (Todos los Santos trasladado) es festivo');
assert(festivos2026.has('2026-11-16'), '16 de Noviembre (Independencia Cartagena trasladada) es festivo');

// =============================================================================
// CASO A: Ritmo exacto
// Horas esperadas acumuladas: 200, Horas reales acumuladas: 200, Diferencia: 0 -> a_tiempo
// =============================================================================
console.log('\n--- CASO A: Ritmo Exacto ---');
{
  // 10 semanas exactas transcurridas de 20h = 200h esperadas
  // Simular fecha al cierre de la semana 10: domingo 11 de Octubre de 2026
  const perfilA: Perfil = {
    ...perfilBase,
    horasInicialesPrevias: 200.0,
  };
  const nowA = new Date(2026, 9, 11, 20, 0, 0); // 2026-10-11
  const metricasA = PacingEngineService.calcularMetricas(perfilA, [], nowA);

  assert(metricasA.horasTotalesCompletadas === 200.0, 'Horas reales acumuladas = 200.0');
  assert(metricasA.horasEsperadasHoy === 200.0, 'Horas esperadas acumuladas = 200.0', `Obtenido: ${metricasA.horasEsperadasHoy}`);
  assert(metricasA.diferenciaHorasRitmo === 0.0, 'Diferencia = 0.0', `Obtenido: ${metricasA.diferenciaHorasRitmo}`);
  assert(metricasA.estadoRitmo === 'a_tiempo', 'Estado es a_tiempo', `Obtenido: ${metricasA.estadoRitmo}`);
}

// =============================================================================
// CASO B: Adelantado
// Horas esperadas acumuladas: 200, Horas reales: 205, Diferencia: +5 -> adelantado
// =============================================================================
console.log('\n--- CASO B: Adelantado ---');
{
  const perfilB: Perfil = {
    ...perfilBase,
    horasInicialesPrevias: 205.0,
  };
  const nowB = new Date(2026, 9, 11, 20, 0, 0);
  const metricasB = PacingEngineService.calcularMetricas(perfilB, [], nowB);

  assert(metricasB.horasTotalesCompletadas === 205.0, 'Horas reales acumuladas = 205.0');
  assert(metricasB.horasEsperadasHoy === 200.0, 'Horas esperadas acumuladas = 200.0');
  assert(metricasB.diferenciaHorasRitmo === 5.0, 'Diferencia = +5.0', `Obtenido: ${metricasB.diferenciaHorasRitmo}`);
  assert(metricasB.estadoRitmo === 'adelantado', 'Estado es adelantado', `Obtenido: ${metricasB.estadoRitmo}`);
  assert(metricasB.mensajeRitmo.includes('adelantado por +5.0 hrs'), 'Mensaje refleja avance positivo');
}

// =============================================================================
// CASO C: Atrasado
// Horas esperadas acumuladas: 200, Horas reales: 195, Diferencia: -5 -> atrasado
// =============================================================================
console.log('\n--- CASO C: Atrasado ---');
{
  const perfilC: Perfil = {
    ...perfilBase,
    horasInicialesPrevias: 195.0,
  };
  const nowC = new Date(2026, 9, 11, 20, 0, 0);
  const metricasC = PacingEngineService.calcularMetricas(perfilC, [], nowC);

  assert(metricasC.horasTotalesCompletadas === 195.0, 'Horas reales acumuladas = 195.0');
  assert(metricasC.horasEsperadasHoy === 200.0, 'Horas esperadas acumuladas = 200.0');
  assert(metricasC.diferenciaHorasRitmo === -5.0, 'Diferencia = -5.0', `Obtenido: ${metricasC.diferenciaHorasRitmo}`);
  assert(metricasC.estadoRitmo === 'atrasado', 'Estado es atrasado', `Obtenido: ${metricasC.estadoRitmo}`);
  assert(metricasC.mensajeRitmo.includes('retraso de 5.0 hrs'), 'Mensaje alerta retraso de 5.0 hrs');
}

// =============================================================================
// CASO D: Semana con festivo
// Meta semanal: 20h. Festivo entre lun-vie. 4 días disponibles.
// La meta sigue siendo 20h. Ritmo necesario en los 4 días disponibles = 5.0h/día
// =============================================================================
console.log('\n--- CASO D: Semana con Festivo (Recuperación en días disponibles) ---');
{
  // Semana del 17 al 23 de agosto de 2026:
  // Lunes 17 de Agosto es festivo (Asunción de la Virgen).
  // Días disponibles de esa semana: martes 18, miércoles 19, jueves 20, viernes 21 (4 días).
  const festivosSet = ColombiaHolidaysService.obtenerFestivosPorAnio(2026);
  const semanas = PacingEngineService.construirSemanasPracticas(perfilBase, festivosSet);

  const semanaFestivo = semanas.find((s) => s.lunesIso === '2026-08-17');
  assert(!!semanaFestivo, 'Semana del 17 de agosto localizada');
  assert(semanaFestivo!.diasDisponibles.length === 4, 'Tiene exactamente 4 días disponibles (excluye lunes 17 festivo)', `Obtenido: ${semanaFestivo?.diasDisponibles.length}`);
  assert(semanaFestivo!.metaSemana === 20.0, 'La meta de la semana se mantiene en 20.0h a pesar del festivo');
  assert(!semanaFestivo!.diasDisponibles.includes('2026-08-17'), 'Lunes 17 no está en los días disponibles');

  // Evaluar proyección diaria en esa semana cuando no hay registros aún
  // Para esa semana completa de 20h con 4 días disponibles: 20h / 4 días = 5.0h/día
  const perfilSemanaFestivo: Perfil = {
    ...perfilBase,
    fechaInicio: '2026-08-17',
    fechaFin: '2026-08-23',
    metaHorasTotal: 20.0,
    horasInicialesPrevias: 0.0,
  };
  const nowMartes18 = new Date(2026, 7, 18, 7, 0, 0); // Martes 18 de agosto antes de turno
  const metricasFestivo = PacingEngineService.calcularMetricas(perfilSemanaFestivo, [], nowMartes18);

  assert(metricasFestivo.diasHabilesRestantes === 4, '4 días hábiles disponibles restantes');
  assert(metricasFestivo.ritmoDiarioSugerido === 5.0, 'Ritmo necesario distribuido en los 4 días es 5.0 hrs/día (20h / 4d)', `Obtenido: ${metricasFestivo.ritmoDiarioSugerido}`);
}

// =============================================================================
// CASO E: Fecha de finalización
// 1. Llegar al 20 de noviembre con horas faltantes -> vencido
// 2. Horas completadas al 100% antes de esa fecha -> estado y mensaje coherente
// =============================================================================
console.log('\n--- CASO E: Fecha de Finalización y Completitud ---');
{
  // 1. Periodo vencido con horas faltantes
  const perfilVencido: Perfil = {
    ...perfilBase,
    horasInicialesPrevias: 300.0, // Faltan 20h
  };
  const nowPostFin = new Date(2026, 10, 21, 10, 0, 0); // 2026-11-21
  const metricasVencido = PacingEngineService.calcularMetricas(perfilVencido, [], nowPostFin);

  assert(metricasVencido.estadoRitmo === 'vencido', 'Estado es vencido tras pasar fechaFin con horas pendientes');
  assert(metricasVencido.horasRestantes === 20.0, 'Horas restantes = 20.0');
  assert(metricasVencido.diasHabilesRestantes === 0, 'Días restantes = 0');
  assert(metricasVencido.mensajeRitmo.includes('finalizó con 20.0 hrs pendientes'), 'Mensaje alerta periodo finalizado con horas pendientes');

  // 2. Horas completadas al 100% antes de la fecha fin
  const perfilCompletado: Perfil = {
    ...perfilBase,
    horasInicialesPrevias: 320.0,
  };
  const nowMitad = new Date(2026, 8, 15, 10, 0, 0); // Septiembre
  const metricasCompletado = PacingEngineService.calcularMetricas(perfilCompletado, [], nowMitad);

  assert(metricasCompletado.horasRestantes === 0, 'Horas restantes = 0');
  assert(metricasCompletado.porcentajeProgreso === 100, 'Progreso = 100%');
  assert(metricasCompletado.estadoRitmo === 'adelantado', 'Estado es adelantado al completar antes de tiempo');
  assert(metricasCompletado.mensajeRitmo.includes('¡Completaste el 100% de tus horas'), 'Mensaje festivo de completitud');
}

// =============================================================================
// CASO F: Casos Límite y Robustez
// =============================================================================
console.log('\n--- CASO F: Casos Límite ---');
{
  // F1. Perfil sin fechas configuradas
  const perfilSinFechas: Perfil = {
    ...perfilBase,
    fechaInicio: null,
    fechaFin: null,
  };
  const metricasSinFechas = PacingEngineService.calcularMetricas(perfilSinFechas, []);
  assert(metricasSinFechas.estadoRitmo === 'sin_fechas', 'F1: Sin fechas retorna estado sin_fechas');
  assert(metricasSinFechas.mensajeRitmo.includes('Configura las fechas'), 'F1: Mensaje solicita configuración');

  // F2. Periodo futuro (antes de fechaInicio)
  const nowAntes = new Date(2026, 6, 20); // 20 de julio (antes del 4 de agosto)
  const metricasAntes = PacingEngineService.calcularMetricas(perfilBase, [], nowAntes);
  assert(metricasAntes.estadoRitmo === 'a_tiempo', 'F2: Periodo no iniciado mantiene estado a_tiempo');
  assert(metricasAntes.mensajeRitmo.includes('inicia el 2026-08-04'), 'F2: Informa fecha de inicio');

  // F3. Día actual con registro vs sin registro (evitar doble cómputo)
  const perfilIntraDia: Perfil = {
    ...perfilBase,
    fechaInicio: '2026-08-10', // Lunes 10 de Agosto (sin festivo esa semana)
    fechaFin: '2026-08-16',
    metaHorasTotal: 20.0,
    horasInicialesPrevias: 0.0,
  };
  // Lunes 10 antes del registro
  const nowLunesSinReg = new Date(2026, 7, 10, 8, 0, 0);
  const metricasSinReg = PacingEngineService.calcularMetricas(perfilIntraDia, [], nowLunesSinReg);
  assert(metricasSinReg.diasHabilesRestantes === 5, 'F3: Lunes por la mañana sin registro cuenta como 5 días restantes');
  assert(metricasSinReg.horasEsperadasHoy === 0, 'F3: Horas esperadas antes de ejecutar el lunes = 0');

  // Lunes 10 después de registrar 4h de la jornada
  const registrosLunes: RegistroHora[] = [{
    id: 'reg-lunes-10',
    userId: 'user-pacing-test',
    fecha: '2026-08-10',
    horaInicio: '08:00',
    horaFin: '12:00',
    descuentoAlmuerzoMinutos: 0,
    horasComputables: 4.0,
    modalidad: 'Presencial',
    actividades: 'Desarrollo',
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
  }];
  const nowLunesConReg = new Date(2026, 7, 10, 13, 0, 0);
  const metricasConReg = PacingEngineService.calcularMetricas(perfilIntraDia, registrosLunes, nowLunesConReg);

  assert(metricasConReg.diasHabilesRestantes === 4, 'F3: Lunes con registro ya no cuenta para el futuro (4 días restantes)');
  assert(metricasConReg.horasEsperadasHoy === 4.0, 'F3: Horas esperadas tras completar lunes = 4.0h (1 de 5 días de 20h)');
  assert(metricasConReg.diferenciaHorasRitmo === 0.0, 'F3: Diferencia es 0.0 tras registrar exactamente la jornada');
  assert(metricasConReg.ritmoDiarioSugerido === 4.0, 'F3: Ritmo sugerido para los 4 días restantes es 4.0h/día (16h / 4d)');

  // F4. Festivo en domingo (no afecta días laborales de lun-vie)
  // El 1 de noviembre de 2026 cae domingo y la Ley Emiliani lo traslada al lunes 2 de noviembre.
  // El lunes 2 de noviembre debe quedar excluido, pero la semana previa no se altera.
  const festivosSetDom = ColombiaHolidaysService.obtenerFestivosPorAnio(2026);
  assert(festivosSetDom.has('2026-11-02'), 'F4: Festivo del domingo 1 de nov se traslada al lunes 2 de nov');

  // F5. Alerta de sobrecarga cuando el ritmo excede la jornada máxima
  const perfilAtrasadisimo: Perfil = {
    ...perfilBase,
    fechaInicio: '2026-08-04',
    fechaFin: '2026-08-07', // 3 días disponibles
    metaHorasTotal: 100.0,
    horasInicialesPrevias: 0.0,
  };
  const metricasSobrecarga = PacingEngineService.calcularMetricas(perfilAtrasadisimo, [], new Date(2026, 7, 4));
  assert(metricasSobrecarga.ritmoDiarioSugerido > 8.0, 'F5: Detecta ritmo mayor a 8h/día');
  assert(metricasSobrecarga.mensajeRitmo.includes('excede la jornada máxima legal'), 'F5: Mensaje alerta sobrecarga legal');
}

// =============================================================================
// RESUMEN
// =============================================================================
console.log('\n==================================================================');
console.log(`📊 Pruebas Unitarias de PacingEngineService: ${passedTests}/${totalTests} superadas.`);
if (passedTests === totalTests) {
  console.log('🎉 ¡TODAS LAS PRUEBAS UNITARIAS PASARON EXITOSAMENTE!');
} else {
  console.error('⚠️ Hubo fallos en las pruebas.');
  process.exit(1);
}
console.log('==================================================================\n');
