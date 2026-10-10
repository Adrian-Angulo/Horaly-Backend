export declare const swaggerDocument: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact: {
            name: string;
            email: string;
        };
        license: {
            name: string;
            url: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
                description: string;
            };
        };
        schemas: {
            DiaHorario: {
                type: string;
                properties: {
                    diaSemana: {
                        type: string;
                        example: string;
                    };
                    activo: {
                        type: string;
                        example: boolean;
                    };
                    horaInicio: {
                        type: string;
                        example: string;
                        pattern: string;
                    };
                    horaFin: {
                        type: string;
                        example: string;
                        pattern: string;
                    };
                    refrigerioMinutos: {
                        type: string;
                        example: number;
                        minimum: number;
                        maximum: number;
                    };
                    modalidad: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                };
                required: string[];
            };
            HorarioSemanal: {
                type: string;
                properties: {
                    lunes: {
                        $ref: string;
                    };
                    martes: {
                        $ref: string;
                    };
                    miercoles: {
                        $ref: string;
                    };
                    jueves: {
                        $ref: string;
                    };
                    viernes: {
                        $ref: string;
                    };
                    sabado: {
                        $ref: string;
                    };
                    domingo: {
                        $ref: string;
                    };
                };
            };
            Perfil: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    email: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    nombre: {
                        type: string;
                        example: string;
                    };
                    carrera: {
                        type: string;
                        example: string;
                    };
                    semestre: {
                        type: string;
                        example: string;
                    };
                    metaHorasTotal: {
                        type: string;
                        example: number;
                    };
                    horasInicialesPrevias: {
                        type: string;
                        example: number;
                    };
                    horasMinimasSemanales: {
                        type: string;
                        example: number;
                    };
                    perfilCompletado: {
                        type: string;
                        example: boolean;
                    };
                    fechaInicio: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    fechaFin: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    horarioSemanal: {
                        $ref: string;
                    };
                    avatarUrl: {
                        type: string;
                        nullable: boolean;
                        example: string;
                    };
                };
            };
            RegistroHora: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    userId: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    fecha: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    horaInicio: {
                        type: string;
                        example: string;
                    };
                    horaFin: {
                        type: string;
                        example: string;
                    };
                    descuentoAlmuerzoMinutos: {
                        type: string;
                        example: number;
                    };
                    horasComputables: {
                        type: string;
                        example: number;
                    };
                    modalidad: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    actividades: {
                        type: string;
                        example: string;
                    };
                    supervisorNombre: {
                        type: string;
                        nullable: boolean;
                        example: string;
                    };
                    estado: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            MetricasDashboard: {
                type: string;
                properties: {
                    horasTotalesCompletadas: {
                        type: string;
                        example: number;
                    };
                    horasPreviasCursadas: {
                        type: string;
                        example: number;
                    };
                    horasRegistradasEnApp: {
                        type: string;
                        example: number;
                    };
                    metaHorasTotal: {
                        type: string;
                        example: number;
                    };
                    horasRestantes: {
                        type: string;
                        example: number;
                    };
                    porcentajeProgreso: {
                        type: string;
                        example: number;
                    };
                    horasEstaSemana: {
                        type: string;
                        example: number;
                    };
                    horasEsteMes: {
                        type: string;
                        example: number;
                    };
                    totalDiasTrabajados: {
                        type: string;
                        example: number;
                    };
                    promedioHorasPorDia: {
                        type: string;
                        example: number;
                    };
                    horasPorDiaSemana: {
                        type: string;
                        properties: {
                            '1': {
                                type: string;
                                example: number;
                            };
                            '2': {
                                type: string;
                                example: number;
                            };
                            '3': {
                                type: string;
                                example: number;
                            };
                            '4': {
                                type: string;
                                example: number;
                            };
                            '5': {
                                type: string;
                                example: number;
                            };
                            '6': {
                                type: string;
                                example: number;
                            };
                            '7': {
                                type: string;
                                example: number;
                            };
                        };
                    };
                    estadoRitmo: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    diferenciaHorasRitmo: {
                        type: string;
                        example: number;
                    };
                    horasEsperadasHoy: {
                        type: string;
                        example: number;
                    };
                    ritmoDiarioSugerido: {
                        type: string;
                        example: number;
                    };
                    diasHabilesRestantes: {
                        type: string;
                        example: number;
                    };
                    mensajeRitmo: {
                        type: string;
                        example: string;
                    };
                };
            };
            RegisterInput: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        format: string;
                        minLength: number;
                        example: string;
                    };
                    nombre: {
                        type: string;
                        minLength: number;
                        example: string;
                    };
                    nombreCompleto: {
                        type: string;
                        minLength: number;
                        example: string;
                    };
                    carrera: {
                        type: string;
                        example: string;
                    };
                    semestre: {
                        type: string;
                        example: string;
                    };
                    metaHorasTotal: {
                        type: string;
                        example: number;
                    };
                    horasInicialesPrevias: {
                        type: string;
                        example: number;
                    };
                    fechaInicio: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    fechaFin: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    horarioSemanal: {
                        $ref: string;
                    };
                };
            };
            LoginInput: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        format: string;
                        example: string;
                    };
                };
            };
            RefreshTokenInput: {
                type: string;
                required: string[];
                properties: {
                    refreshToken: {
                        type: string;
                        example: string;
                    };
                };
            };
            ForgotPasswordInput: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                        example: string;
                    };
                };
            };
            ResetPasswordInput: {
                type: string;
                required: string[];
                properties: {
                    token: {
                        type: string;
                        example: string;
                    };
                    newPassword: {
                        type: string;
                        format: string;
                        minLength: number;
                        example: string;
                    };
                };
            };
            UpdateProfileInput: {
                type: string;
                properties: {
                    nombre: {
                        type: string;
                        example: string;
                    };
                    nombreCompleto: {
                        type: string;
                        example: string;
                    };
                    carrera: {
                        type: string;
                        example: string;
                    };
                    semestre: {
                        type: string;
                        example: string;
                    };
                    fechaInicio: {
                        type: string;
                        format: string;
                        nullable: boolean;
                        example: string;
                    };
                    fechaFin: {
                        type: string;
                        format: string;
                        nullable: boolean;
                        example: string;
                    };
                    metaHorasTotal: {
                        type: string;
                        example: number;
                    };
                    horasInicialesPrevias: {
                        type: string;
                        example: number;
                    };
                    horasMinimasSemanales: {
                        type: string;
                        example: number;
                    };
                    perfilCompletado: {
                        type: string;
                        example: boolean;
                    };
                    horarioSemanal: {
                        $ref: string;
                    };
                    avatarUrl: {
                        type: string;
                        nullable: boolean;
                        example: string;
                    };
                };
            };
            CrearRegistroInput: {
                type: string;
                required: string[];
                properties: {
                    fecha: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    horaInicio: {
                        type: string;
                        example: string;
                        pattern: string;
                    };
                    horaFin: {
                        type: string;
                        example: string;
                        pattern: string;
                    };
                    descuentoAlmuerzoMinutos: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        example: number;
                    };
                    refrigerioMinutos: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        example: number;
                    };
                    modalidad: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    actividades: {
                        type: string;
                        minLength: number;
                        example: string;
                    };
                    supervisorNombre: {
                        type: string;
                        nullable: boolean;
                        example: string;
                    };
                    estado: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                };
            };
            ActualizarRegistroInput: {
                type: string;
                properties: {
                    fecha: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    horaInicio: {
                        type: string;
                        example: string;
                    };
                    horaFin: {
                        type: string;
                        example: string;
                    };
                    descuentoAlmuerzoMinutos: {
                        type: string;
                        example: number;
                    };
                    refrigerioMinutos: {
                        type: string;
                        example: number;
                    };
                    modalidad: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                    actividades: {
                        type: string;
                        example: string;
                    };
                    supervisorNombre: {
                        type: string;
                        nullable: boolean;
                        example: string;
                    };
                    estado: {
                        type: string;
                        enum: string[];
                        example: string;
                    };
                };
            };
            SyncBatchInput: {
                type: string;
                properties: {
                    perfil: {
                        $ref: string;
                    };
                    registros: {
                        type: string;
                        properties: {
                            creados: {
                                type: string;
                                items: {
                                    $ref: string;
                                };
                            };
                            actualizados: {
                                type: string;
                                items: {
                                    type: string;
                                    required: string[];
                                    properties: {
                                        id: {
                                            type: string;
                                            format: string;
                                        };
                                        fecha: {
                                            type: string;
                                            format: string;
                                        };
                                        horaInicio: {
                                            type: string;
                                        };
                                        horaFin: {
                                            type: string;
                                        };
                                        actividades: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                            eliminadosIds: {
                                type: string;
                                items: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                };
            };
            ErrorResponse: {
                type: string;
                properties: {
                    statusCode: {
                        type: string;
                        example: number;
                    };
                    error: {
                        type: string;
                        example: string;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    timestamp: {
                        type: string;
                        format: string;
                    };
                    details: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
        };
    };
    paths: {
        '/api/health': {
            get: {
                tags: string[];
                summary: string;
                description: string;
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        status: {
                                            type: string;
                                            example: string;
                                        };
                                        timestamp: {
                                            type: string;
                                            format: string;
                                        };
                                        environment: {
                                            type: string;
                                            example: string;
                                        };
                                        version: {
                                            type: string;
                                            example: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/v1/auth/register': {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        user: {
                                            $ref: string;
                                        };
                                        accessToken: {
                                            type: string;
                                        };
                                        refreshToken: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '400': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '409': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/login': {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        accessToken: {
                                            type: string;
                                            example: string;
                                        };
                                        refreshToken: {
                                            type: string;
                                            example: string;
                                        };
                                        expiresIn: {
                                            type: string;
                                            example: number;
                                        };
                                        user: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/v1/auth/refresh': {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        accessToken: {
                                            type: string;
                                        };
                                        refreshToken: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/me': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/forgot-password': {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/reset-password': {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                    '400': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/logout': {
            post: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/profile': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '400': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/registros': {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        minimum: number;
                        maximum: number;
                        enum?: undefined;
                        format?: undefined;
                    };
                    description: string;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        minimum?: undefined;
                        maximum?: undefined;
                        enum?: undefined;
                        format?: undefined;
                    };
                    description: string;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        enum: string[];
                        minimum?: undefined;
                        maximum?: undefined;
                        format?: undefined;
                    };
                    description?: undefined;
                } | {
                    in: string;
                    name: string;
                    schema: {
                        type: string;
                        format: string;
                        minimum?: undefined;
                        maximum?: undefined;
                        enum?: undefined;
                    };
                    description: string;
                })[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '400': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/registros/export/csv': {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'text/csv': {
                                schema: {
                                    type: string;
                                    example: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/v1/registros/{id}': {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    in: string;
                    name: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                    description: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    in: string;
                    name: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                    description: string;
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    in: string;
                    name: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                    description: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/metricas/dashboard': {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/sync/batch': {
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        creados: {
                                            type: string;
                                            example: number;
                                        };
                                        actualizados: {
                                            type: string;
                                            example: number;
                                        };
                                        eliminados: {
                                            type: string;
                                            example: number;
                                        };
                                        perfilActualizado: {
                                            type: string;
                                            example: boolean;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '400': {
                        description: string;
                    };
                };
            };
        };
    };
};
