export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'PractiHoras Backend API',
    version: '1.1.0',
    description: `
**API REST para el Sistema de Gestión y Control de Horas de Prácticas Pre-Profesionales.**

Desarrollada bajo principios de **Clean Architecture**, TypeScript y Express, con soporte para clientes móviles (Flutter) y web.

### Características Principales:
* **Autenticación Robusta:** JWT con Supabase Auth y control de sesiones.
* **Control de Jornadas:** Registro de horas con cálculo automático de horas netas computables y refrigerio.
* **Motor de Ritmo (Pacing Engine):** Proyección inteligente de avance, alerta de sobrecarga laboral y estimación diaria.
* **Sincronización Batch:** Soporte para clientes móviles con sincronización por lotes.
* **Exportación Académica:** Descarga de registros en formato CSV estándar.

### Autenticación:
Para probar los endpoints protegidos:
1. Regístrate o inicia sesión en \`/api/v1/auth/login\`.
2. Copia el \`accessToken\`.
3. Haz clic en el botón superior **Authorize (🔓)** e ingresa el token con formato \`Bearer <tu_token>\` o simplemente el token.
    `,
    contact: {
      name: 'Equipo de Desarrollo PractiHoras',
      email: 'soporte@practihoras.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local de Desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT devuelto al iniciar sesión en /api/v1/auth/login',
      },
    },
    schemas: {
      // Entidades y Modelos
      DiaHorario: {
        type: 'object',
        properties: {
          diaSemana: { type: 'string', example: 'lunes' },
          activo: { type: 'boolean', example: true },
          horaInicio: { type: 'string', example: '08:00', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' },
          horaFin: { type: 'string', example: '13:00', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' },
          refrigerioMinutos: { type: 'integer', example: 0, minimum: 0, maximum: 180 },
          modalidad: { type: 'string', enum: ['Presencial', 'Remoto', 'Híbrido'], example: 'Presencial' },
        },
        required: ['activo', 'horaInicio', 'horaFin', 'refrigerioMinutos', 'modalidad'],
      },
      HorarioSemanal: {
        type: 'object',
        properties: {
          lunes: { $ref: '#/components/schemas/DiaHorario' },
          martes: { $ref: '#/components/schemas/DiaHorario' },
          miercoles: { $ref: '#/components/schemas/DiaHorario' },
          jueves: { $ref: '#/components/schemas/DiaHorario' },
          viernes: { $ref: '#/components/schemas/DiaHorario' },
          sabado: { $ref: '#/components/schemas/DiaHorario' },
          domingo: { $ref: '#/components/schemas/DiaHorario' },
        },
      },
      Perfil: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
          email: { type: 'string', format: 'email', example: 'practicante@universidad.edu.pe' },
          nombre: { type: 'string', example: 'Juan Pérez' },
          carrera: { type: 'string', example: 'Ingeniería de Software' },
          semestre: { type: 'string', example: '2025-1' },
          metaHorasTotal: { type: 'number', example: 360 },
          horasInicialesPrevias: { type: 'number', example: 40 },
          horasMinimasSemanales: { type: 'number', example: 30 },
          perfilCompletado: { type: 'boolean', example: true },
          fechaInicio: { type: 'string', format: 'date', example: '2026-03-01' },
          fechaFin: { type: 'string', format: 'date', example: '2026-06-30' },
          horarioSemanal: { $ref: '#/components/schemas/HorarioSemanal' },
          avatarUrl: { type: 'string', nullable: true, example: 'https://ejemplo.com/avatar.jpg' },
        },
      },
      RegistroHora: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          userId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
          fecha: { type: 'string', format: 'date', example: '2026-03-02' },
          horaInicio: { type: 'string', example: '08:00' },
          horaFin: { type: 'string', example: '13:00' },
          descuentoAlmuerzoMinutos: { type: 'integer', example: 0 },
          horasComputables: { type: 'number', example: 5.0 },
          modalidad: { type: 'string', enum: ['Presencial', 'Remoto', 'Híbrido'], example: 'Presencial' },
          actividades: { type: 'string', example: 'Desarrollo de módulos frontend y pruebas' },
          supervisorNombre: { type: 'string', nullable: true, example: 'Ing. Carlos Mendoza' },
          estado: { type: 'string', enum: ['Borrador', 'Pendiente', 'Aprobado', 'Observado'], example: 'Aprobado' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MetricasDashboard: {
        type: 'object',
        properties: {
          horasTotalesCompletadas: { type: 'number', example: 50.0 },
          horasPreviasCursadas: { type: 'number', example: 40.0 },
          horasRegistradasEnApp: { type: 'number', example: 10.0 },
          metaHorasTotal: { type: 'number', example: 360.0 },
          horasRestantes: { type: 'number', example: 310.0 },
          porcentajeProgreso: { type: 'number', example: 13.9 },
          horasEstaSemana: { type: 'number', example: 10.0 },
          horasEsteMes: { type: 'number', example: 10.0 },
          totalDiasTrabajados: { type: 'integer', example: 2 },
          promedioHorasPorDia: { type: 'number', example: 5.0 },
          horasPorDiaSemana: {
            type: 'object',
            properties: {
              '1': { type: 'number', example: 5.0 },
              '2': { type: 'number', example: 5.0 },
              '3': { type: 'number', example: 0.0 },
              '4': { type: 'number', example: 0.0 },
              '5': { type: 'number', example: 0.0 },
              '6': { type: 'number', example: 0.0 },
              '7': { type: 'number', example: 0.0 },
            },
          },
          estadoRitmo: {
            type: 'string',
            enum: ['adelantado', 'a_tiempo', 'atrasado', 'vencido', 'sin_fechas'],
            example: 'a_tiempo',
          },
          diferenciaHorasRitmo: { type: 'number', example: 0.0 },
          horasEsperadasHoy: { type: 'number', example: 8.3 },
          ritmoDiarioSugerido: { type: 'number', example: 4.8 },
          diasHabilesRestantes: { type: 'integer', example: 65 },
          mensajeRitmo: { type: 'string', example: '⏱️ Vas al día según tu planificación.' },
        },
      },

      // Request DTOs
      RegisterInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'practicante@uni.edu.pe' },
          password: { type: 'string', format: 'password', minLength: 6, example: 'ContrasenaSegura123' },
          nombre: { type: 'string', minLength: 2, example: 'Juan Pérez' },
          nombreCompleto: { type: 'string', minLength: 2, example: 'Juan Carlos Pérez Gómez' },
          carrera: { type: 'string', example: 'Ingeniería de Software' },
          semestre: { type: 'string', example: 'Semestre 2025-1' },
          metaHorasTotal: { type: 'number', example: 360 },
          horasInicialesPrevias: { type: 'number', example: 0 },
          fechaInicio: { type: 'string', format: 'date', example: '2026-03-01' },
          fechaFin: { type: 'string', format: 'date', example: '2026-06-30' },
          horarioSemanal: { $ref: '#/components/schemas/HorarioSemanal' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'practicante@uni.edu.pe' },
          password: { type: 'string', format: 'password', example: 'ContrasenaSegura123' },
        },
      },
      RefreshTokenInput: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...' },
        },
      },
      ForgotPasswordInput: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'practicante@uni.edu.pe' },
        },
      },
      ResetPasswordInput: {
        type: 'object',
        required: ['token', 'newPassword'],
        properties: {
          token: { type: 'string', example: 'token_de_recuperacion_123' },
          newPassword: { type: 'string', format: 'password', minLength: 6, example: 'NuevaClave456!' },
        },
      },
      UpdateProfileInput: {
        type: 'object',
        properties: {
          nombre: { type: 'string', example: 'Juan Pérez' },
          nombreCompleto: { type: 'string', example: 'Juan Carlos Pérez Gómez' },
          carrera: { type: 'string', example: 'Ingeniería de Sistemas' },
          semestre: { type: 'string', example: '2025-2' },
          fechaInicio: { type: 'string', format: 'date', nullable: true, example: '2026-03-01' },
          fechaFin: { type: 'string', format: 'date', nullable: true, example: '2026-06-30' },
          metaHorasTotal: { type: 'number', example: 360 },
          horasInicialesPrevias: { type: 'number', example: 40 },
          horasMinimasSemanales: { type: 'number', example: 30 },
          perfilCompletado: { type: 'boolean', example: true },
          horarioSemanal: { $ref: '#/components/schemas/HorarioSemanal' },
          avatarUrl: { type: 'string', nullable: true, example: 'https://ejemplo.com/foto.jpg' },
        },
      },
      CrearRegistroInput: {
        type: 'object',
        required: ['fecha', 'horaInicio', 'horaFin', 'actividades'],
        properties: {
          fecha: { type: 'string', format: 'date', example: '2026-03-02' },
          horaInicio: { type: 'string', example: '08:00', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' },
          horaFin: { type: 'string', example: '13:00', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' },
          descuentoAlmuerzoMinutos: { type: 'integer', minimum: 0, maximum: 180, example: 0 },
          refrigerioMinutos: { type: 'integer', minimum: 0, maximum: 180, example: 0 },
          modalidad: { type: 'string', enum: ['Presencial', 'Remoto', 'Híbrido'], example: 'Presencial' },
          actividades: { type: 'string', minLength: 2, example: 'Desarrollo de pantallas e integración con Supabase' },
          supervisorNombre: { type: 'string', nullable: true, example: 'Ing. Carlos Mendoza' },
          estado: { type: 'string', enum: ['Borrador', 'Pendiente', 'Aprobado', 'Observado'], example: 'Aprobado' },
        },
      },
      ActualizarRegistroInput: {
        type: 'object',
        properties: {
          fecha: { type: 'string', format: 'date', example: '2026-03-02' },
          horaInicio: { type: 'string', example: '08:30' },
          horaFin: { type: 'string', example: '13:30' },
          descuentoAlmuerzoMinutos: { type: 'integer', example: 0 },
          refrigerioMinutos: { type: 'integer', example: 0 },
          modalidad: { type: 'string', enum: ['Presencial', 'Remoto', 'Híbrido'], example: 'Híbrido' },
          actividades: { type: 'string', example: 'Corrección de errores y pruebas unitarias' },
          supervisorNombre: { type: 'string', nullable: true, example: 'Ing. Carlos Mendoza' },
          estado: { type: 'string', enum: ['Borrador', 'Pendiente', 'Aprobado', 'Observado'], example: 'Aprobado' },
        },
      },
      SyncBatchInput: {
        type: 'object',
        properties: {
          perfil: { $ref: '#/components/schemas/UpdateProfileInput' },
          registros: {
            type: 'object',
            properties: {
              creados: {
                type: 'array',
                items: { $ref: '#/components/schemas/CrearRegistroInput' },
              },
              actualizados: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id'],
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    fecha: { type: 'string', format: 'date' },
                    horaInicio: { type: 'string' },
                    horaFin: { type: 'string' },
                    actividades: { type: 'string' },
                  },
                },
              },
              eliminadosIds: {
                type: 'array',
                items: { type: 'string', format: 'uuid' },
              },
            },
          },
        },
      },

      // Respuestas genéricas
      ErrorResponse: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 400 },
          error: { type: 'string', example: 'Bad Request' },
          message: { type: 'string', example: 'Los datos proporcionados son inválidos' },
          timestamp: { type: 'string', format: 'date-time' },
          details: { type: 'object', nullable: true },
        },
      },
    },
  },
  paths: {
    // Health Check
    '/api/health': {
      get: {
        tags: ['Sistema & Salud'],
        summary: 'Verificar salud y estado del servidor',
        description: 'Endpoint público para monitor de salud (uptime, versión y entorno).',
        responses: {
          '200': {
            description: 'Servidor operativo y saludable',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'UP' },
                    timestamp: { type: 'string', format: 'date-time' },
                    environment: { type: 'string', example: 'development' },
                    version: { type: 'string', example: '1.1.0' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // Auth Endpoints
    '/api/v1/auth/register': {
      post: {
        tags: ['Autenticación'],
        summary: 'Registrar un nuevo practicante',
        description: 'Crea una nueva cuenta de usuario y perfil inicial en el sistema.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuario registrado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Usuario registrado con éxito' },
                    user: { $ref: '#/components/schemas/Perfil' },
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'Datos de registro inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '409': { description: 'El correo electrónico ya se encuentra registrado' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión',
        description: 'Autentica las credenciales del practicante y retorna tokens JWT.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Inicio de sesión exitoso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                    refreshToken: { type: 'string', example: 'ref_token_xyz...' },
                    expiresIn: { type: 'integer', example: 3600 },
                    user: { $ref: '#/components/schemas/Perfil' },
                  },
                },
              },
            },
          },
          '401': { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/v1/auth/refresh': {
      post: {
        tags: ['Autenticación'],
        summary: 'Refrescar token de acceso',
        description: 'Emite un nuevo JWT usando el refresh token sin requerir credenciales.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Token refrescado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': { description: 'Refresh token inválido o expirado' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Autenticación'],
        summary: 'Obtener datos del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Datos del usuario autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Perfil' },
              },
            },
          },
          '401': { description: 'Token no proporcionado o inválido' },
        },
      },
    },
    '/api/v1/auth/forgot-password': {
      post: {
        tags: ['Autenticación'],
        summary: 'Solicitar recuperación de contraseña',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForgotPasswordInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Correo de recuperación enviado si el email existe' },
        },
      },
    },
    '/api/v1/auth/reset-password': {
      post: {
        tags: ['Autenticación'],
        summary: 'Restablecer contraseña mediante token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Contraseña actualizada exitosamente' },
          '400': { description: 'Token inválido o expirado' },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['Autenticación'],
        summary: 'Cerrar sesión',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Sesión cerrada con éxito' },
        },
      },
    },

    // Profile Endpoints
    '/api/v1/profile': {
      get: {
        tags: ['Perfil de Practicante'],
        summary: 'Obtener perfil completo y horario semanal',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Perfil del practicante obtenido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Perfil' },
              },
            },
          },
          '401': { description: 'No autenticado' },
        },
      },
      put: {
        tags: ['Perfil de Practicante'],
        summary: 'Actualizar perfil, horario semanal o fechas de convenio',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProfileInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Perfil actualizado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Perfil' },
              },
            },
          },
          '400': { description: 'Datos de perfil inválidos' },
        },
      },
    },

    // Registros Endpoints
    '/api/v1/registros': {
      get: {
        tags: ['Registros de Horas'],
        summary: 'Listar registros de prácticas',
        description: 'Permite filtrar por mes, año, rango de fechas y modalidad.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'mes', schema: { type: 'integer', minimum: 1, maximum: 12 }, description: 'Mes numérico (1-12)' },
          { in: 'query', name: 'anio', schema: { type: 'integer' }, description: 'Año (ej. 2026)' },
          { in: 'query', name: 'modalidad', schema: { type: 'string', enum: ['Presencial', 'Remoto', 'Híbrido'] } },
          { in: 'query', name: 'desde', schema: { type: 'string', format: 'date' }, description: 'Fecha inicio YYYY-MM-DD' },
          { in: 'query', name: 'hasta', schema: { type: 'string', format: 'date' }, description: 'Fecha fin YYYY-MM-DD' },
          { in: 'query', name: 'limite', schema: { type: 'integer' }, description: 'Cantidad máxima de registros' },
        ],
        responses: {
          '200': {
            description: 'Lista de registros encontrados',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/RegistroHora' },
                },
              },
            },
          },
          '401': { description: 'No autenticado' },
        },
      },
      post: {
        tags: ['Registros de Horas'],
        summary: 'Crear un nuevo registro de prácticas',
        description: 'Calcula automáticamente las horas computables descontando el refrigerio.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CrearRegistroInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Registro creado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegistroHora' },
              },
            },
          },
          '400': { description: 'Horas o datos inconsistentes' },
        },
      },
    },
    '/api/v1/registros/export/csv': {
      get: {
        tags: ['Registros de Horas'],
        summary: 'Exportar registros en formato CSV',
        description: 'Descarga un archivo CSV con el detalle de todas las jornadas para la universidad o empresa.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Archivo CSV descargado',
            content: {
              'text/csv': {
                schema: {
                  type: 'string',
                  example: 'Fecha,Hora Inicio,Hora Fin,Refrigerio (min),Horas Computables,Modalidad,Actividades,Supervisor,Estado\n2026-03-02,08:00,13:00,0,5.00,Presencial,"Desarrollo de módulos",Carlos Mendoza,Aprobado',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/registros/{id}': {
      get: {
        tags: ['Registros de Horas'],
        summary: 'Obtener un registro específico por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' }, description: 'ID del registro' },
        ],
        responses: {
          '200': {
            description: 'Registro encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegistroHora' },
              },
            },
          },
          '404': { description: 'Registro no encontrado' },
        },
      },
      put: {
        tags: ['Registros de Horas'],
        summary: 'Actualizar un registro existente',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' }, description: 'ID del registro' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ActualizarRegistroInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Registro actualizado con éxito',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegistroHora' },
              },
            },
          },
          '404': { description: 'Registro no encontrado' },
        },
      },
      delete: {
        tags: ['Registros de Horas'],
        summary: 'Eliminar un registro de horas',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' }, description: 'ID del registro' },
        ],
        responses: {
          '200': {
            description: 'Registro eliminado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Registro eliminado correctamente' },
                  },
                },
              },
            },
          },
          '404': { description: 'Registro no encontrado' },
        },
      },
    },

    // Dashboard & Metrics Endpoints
    '/api/v1/metricas/dashboard': {
      get: {
        tags: ['Métricas & Pacing Engine'],
        summary: 'Obtener métricas del Dashboard y proyección de ritmo',
        description: `
Calcula en tiempo real los KPIs del practicante:
* **Progreso:** Horas completadas, porcentaje y horas restantes.
* **Desglose:** Horas en la semana actual y mes actual, horas por día de la semana.
* **Motor de Ritmo (Pacing Engine):**
  - Estado del ritmo (\`adelantado\`, \`a_tiempo\`, \`atrasado\`, \`vencido\`, \`sin_fechas\`).
  - Días hábiles restantes efectivos (sin dilución de jornada cerrada).
  - Ritmo diario sugerido con advertencia de sobrecarga si supera 6h/día.
        `,
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Métricas analíticas calculadas exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MetricasDashboard' },
              },
            },
          },
          '401': { description: 'No autenticado' },
        },
      },
    },

    // Sync Endpoints
    '/api/v1/sync/batch': {
      post: {
        tags: ['Sincronización Offline'],
        summary: 'Sincronizar lote de datos desde cliente móvil',
        description: 'Permite a la aplicación móvil enviar en una sola petición las creaciones, actualizaciones y eliminaciones realizadas sin conexión.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SyncBatchInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Lote sincronizado con éxito',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    creados: { type: 'integer', example: 3 },
                    actualizados: { type: 'integer', example: 1 },
                    eliminados: { type: 'integer', example: 0 },
                    perfilActualizado: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          '400': { description: 'Error en la estructura del lote' },
        },
      },
    },
  },
};
