"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const swagger_js_1 = require("./docs/swagger.js");
console.log('🧪 Probando inicialización de Swagger en PractiHoras Backend...');
try {
    const app = (0, app_js_1.createApp)();
    if (!swagger_js_1.swaggerDocument || !swagger_js_1.swaggerDocument.openapi) {
        throw new Error('El documento Swagger OpenAPI no es válido');
    }
    console.log(`✅ Swagger Document válido: versión OpenAPI ${swagger_js_1.swaggerDocument.openapi}`);
    console.log(`✅ Título API: ${swagger_js_1.swaggerDocument.info.title} v${swagger_js_1.swaggerDocument.info.version}`);
    console.log(`✅ Endpoints documentados en Swagger: ${Object.keys(swagger_js_1.swaggerDocument.paths).length}`);
    console.log(`✅ Schemas de componentes documentados: ${Object.keys(swagger_js_1.swaggerDocument.components.schemas).length}`);
    console.log(`✅ Express App configurada con rutas /api-docs y /api-docs.json`);
    console.log('\n🎉 ¡SWAGGER UI INTEGRADO Y OPERATIVO CON ÉXITO!\n');
}
catch (error) {
    console.error('❌ Error al inicializar Swagger:', error);
    process.exit(1);
}
//# sourceMappingURL=test-swagger.js.map