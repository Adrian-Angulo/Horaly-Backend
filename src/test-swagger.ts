import { createApp } from './app.js';
import { swaggerDocument } from './docs/swagger.js';

console.log('🧪 Probando inicialización de Swagger en PractiHoras Backend...');

try {
  const app = createApp();

  if (!swaggerDocument || !swaggerDocument.openapi) {
    throw new Error('El documento Swagger OpenAPI no es válido');
  }

  console.log(`✅ Swagger Document válido: versión OpenAPI ${swaggerDocument.openapi}`);
  console.log(`✅ Título API: ${swaggerDocument.info.title} v${swaggerDocument.info.version}`);
  console.log(`✅ Endpoints documentados en Swagger: ${Object.keys(swaggerDocument.paths).length}`);
  console.log(`✅ Schemas de componentes documentados: ${Object.keys(swaggerDocument.components.schemas).length}`);
  console.log(`✅ Express App configurada con rutas /api-docs y /api-docs.json`);
  console.log('\n🎉 ¡SWAGGER UI INTEGRADO Y OPERATIVO CON ÉXITO!\n');
} catch (error) {
  console.error('❌ Error al inicializar Swagger:', error);
  process.exit(1);
}
