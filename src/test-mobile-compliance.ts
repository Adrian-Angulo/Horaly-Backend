import { PacingEngineService } from './modules/metricas/domain/services/pacing-engine.service.js';
import { RegistroCalculoService } from './modules/registros/domain/services/registro-calculo.service.js';
import { Perfil, defaultHorarioSemanal } from './modules/profile/domain/entities/profile.entity.js';
import { RegistroHora } from './modules/registros/domain/entities/registro-hora.entity.js';

console.log('🚀 [TESTS]: Verificando compatibilidad total Backend con FrontendMovil...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName} ${detail ? `-> ${detail}` : ''}`);
  }
}

// -----------------------------------------------------------------------------
// TEST SUITE 1: RegistroCalculoService (Horas Netas Computables)
// -----------------------------------------------------------------------------
console.log('--- Test Suite 1: Cálculo de Horas Netas Computables ---');

const h1 = RegistroCalculoService.calcularHorasComputables('08:00', '13:00', 0);
assert(h1 === 5.0, '08:00 a 13:00 sin almuerzo = 5.0 hrs', `Obtenido: ${h1}`);

const h2 = RegistroCalculoService.calcularHorasComputables('08:00', '17:00', 60);
assert(h2 === 8.0, '08:00 a 17:00 con 60 min almuerzo = 8.0 hrs', `Obtenido: ${h2}`);

const h3 = RegistroCalculoService.calcularHorasComputables('09:30', '13:45', 15);
assert(h3 === 4.0, '09:30 a 13:45 con 15 min descuento = 4.0 hrs', `Obtenido: ${h3}`);

try {
  RegistroCalculoService.calcularHorasComputables('14:00', '12:00', 0);
  assert(false, 'Debería fallar cuando horaInicio >= horaFin');
} catch {
  assert(true, 'Rechaza correctamente inicio mayor a fin');
}

// -----------------------------------------------------------------------------
// TEST SUITE 2: PacingEngineService (Motor de Ritmo)
// -----------------------------------------------------------------------------
console.log('\n--- Test Suite 2: Motor de Ritmo y Cumplimiento (Pacing Engine) ---');

const mockProfile: Perfil = {
  id: 'test-user-123',
  email: 'practicante@uni.edu.pe',
  nombre: 'Juan Pérez',
  metaHorasTotal: 360.0,
  horasInicialesPrevias: 40.0,
  horasMinimasSemanales: 30.0,
  perfilCompletado: true,
  fechaInicio: '2026-03-01',
  fechaFin: '2026-06-30',
  horarioSemanal: defaultHorarioSemanal,
};

const mockRegistros: RegistroHora[] = [
  {
    id: 'reg-1',
    userId: 'test-user-123',
    fecha: '2026-03-02',
    horaInicio: '08:00',
    horaFin: '13:00',
    descuentoAlmuerzoMinutos: 0,
    horasComputables: 5.0,
    modalidad: 'Presencial',
    actividades: 'Desarrollo de pantallas',
    estado: 'Aprobado',
    createdAt: '2026-03-02T13:00:00Z',
    updatedAt: '2026-03-02T13:00:00Z',
  },
  {
    id: 'reg-2',
    userId: 'test-user-123',
    fecha: '2026-03-03',
    horaInicio: '14:00',
    horaFin: '19:00',
    descuentoAlmuerzoMinutos: 0,
    horasComputables: 5.0,
    modalidad: 'Presencial',
    actividades: 'Testing unitario',
    estado: 'Aprobado',
    createdAt: '2026-03-03T19:00:00Z',
    updatedAt: '2026-03-03T19:00:00Z',
  },
];

// Test con fecha simulada '2026-03-04'
const simulatedNow = new Date(2026, 2, 4); // 4 de Marzo de 2026
const metricas = PacingEngineService.calcularMetricas(mockProfile, mockRegistros, simulatedNow);

assert(metricas.horasPreviasCursadas === 40.0, 'Horas previas = 40.0');
assert(metricas.horasRegistradasEnApp === 10.0, 'Horas registradas en app = 10.0');
assert(metricas.horasTotalesCompletadas === 50.0, 'Horas totales completadas = 50.0');
assert(metricas.horasRestantes === 310.0, 'Horas restantes = 310.0');
assert(metricas.totalDiasTrabajados === 2, 'Total días trabajados = 2');
assert(metricas.promedioHorasPorDia === 5.0, 'Promedio horas por día = 5.0');
assert(typeof metricas.estadoRitmo === 'string', `Estado de ritmo válido: ${metricas.estadoRitmo}`);
assert(typeof metricas.mensajeRitmo === 'string' && metricas.mensajeRitmo.length > 0, 'Mensaje de ritmo presente');
assert(metricas.diasHabilesRestantes > 0, `Días hábiles restantes calculados: ${metricas.diasHabilesRestantes}`);

// Test sin fechas configuradas
const profileSinFechas: Perfil = {
  ...mockProfile,
  fechaInicio: null,
  fechaFin: null,
};
const metricasSinFechas = PacingEngineService.calcularMetricas(profileSinFechas, mockRegistros, simulatedNow);
assert(metricasSinFechas.estadoRitmo === 'sin_fechas', 'Estado es sin_fechas cuando no hay fechas');

// Test periodo no iniciado (simulatedNow < fechaInicio)
const profileFuturo: Perfil = {
  ...mockProfile,
  fechaInicio: '2026-04-01',
  fechaFin: '2026-07-31',
};
const metricasFuturo = PacingEngineService.calcularMetricas(profileFuturo, [], new Date(2026, 2, 15));
assert(metricasFuturo.estadoRitmo === 'a_tiempo', 'Periodo no iniciado mantiene estado no punitivo');
assert(metricasFuturo.mensajeRitmo.includes('inicia el 2026-04-01'), 'Mensaje informa fecha de inicio programada');

// Test consistencia intra-día: registrar jornada de hoy no causa falso adelantado
const profileUniforme: Perfil = {
  ...mockProfile,
  horasInicialesPrevias: 0,
  metaHorasTotal: 100,
  fechaInicio: '2026-03-02', // Lunes
  fechaFin: '2026-03-27',    // 20 días hábiles -> 5h/día esperado
};
// Simular lunes 2 de marzo por la tarde habiendo registrado sus 5 hrs de hoy
const registrosHoyLunes: RegistroHora[] = [{
  id: 'reg-lunes',
  userId: 'test-user-123',
  fecha: '2026-03-02',
  horaInicio: '08:00',
  horaFin: '13:00',
  descuentoAlmuerzoMinutos: 0,
  horasComputables: 5.0,
  modalidad: 'Presencial',
  actividades: 'Labores habituales',
  estado: 'Aprobado',
  createdAt: '2026-03-02T13:00:00Z',
  updatedAt: '2026-03-02T13:00:00Z',
}];
const metricasLunesTarde = PacingEngineService.calcularMetricas(profileUniforme, registrosHoyLunes, new Date(2026, 2, 2));
assert(metricasLunesTarde.estadoRitmo === 'a_tiempo', 'Registrar la jornada de hoy mantiene estado a_tiempo (no falso adelantado)');
assert(metricasLunesTarde.diferenciaHorasRitmo === 0, 'Diferencia de ritmo es 0 tras completar exactamente la jornada de hoy');
assert(metricasLunesTarde.diasHabilesRestantes === 19, 'Días restantes no diluyen hoy tras haber registrado (19 días futuros)');
assert(metricasLunesTarde.ritmoDiarioSugerido === 5.0, 'Ritmo diario sugerido futuro se mantiene en 5.0h/día');

// Test advertencia de sobrecarga / límite legal (> 6h/día)
const profileAtrasado: Perfil = {
  ...mockProfile,
  horasInicialesPrevias: 0,
  metaHorasTotal: 100,
  fechaInicio: '2026-03-02',
  fechaFin: '2026-03-13', // 10 días hábiles
};
// Día 5 sin ningún registro
const metricasAtrasadas = PacingEngineService.calcularMetricas(profileAtrasado, [], new Date(2026, 2, 6));
assert(metricasAtrasadas.estadoRitmo === 'atrasado', 'Detecta estado atrasado');
assert(metricasAtrasadas.ritmoDiarioSugerido > 6.0, 'Ritmo requerido es superior a 6h/día');
assert(metricasAtrasadas.mensajeRitmo.includes('excede la jornada habitual'), 'Mensaje alerta sobrecarga de jornada permitida');


// -----------------------------------------------------------------------------
// RESULTADOS
// -----------------------------------------------------------------------------
console.log(`\n======================================================`);
console.log(`📊 Pruebas Completadas: ${passedTests}/${totalTests} superadas.`);
if (passedTests === totalTests) {
  console.log(`🎉 ¡TODOS LOS TESTS DE COMPATIBILIDAD CON FRONTENDMOVIL PASARON EXITOSAMENTE!`);
} else {
  console.error(`⚠️ Hubo fallos en la suite de pruebas.`);
  process.exit(1);
}
console.log(`======================================================\n`);
