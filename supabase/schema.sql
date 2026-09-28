-- ==============================================================================
-- PRACTIHORAS - ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- Clean Architecture & SOLID — Compatible con Frontend Web y Frontend Móvil (Flutter)
-- ==============================================================================

-- 1. LIMPIEZA INICIAL (RESET SEGURO)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_perfiles_updated_at ON public.perfiles;
DROP TRIGGER IF EXISTS trg_registros_horas_updated_at ON public.registros_horas;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

DROP TABLE IF EXISTS public.registros_horas CASCADE;
DROP TABLE IF EXISTS public.tokens_recuperacion CASCADE;
DROP TABLE IF EXISTS public.intentos_login CASCADE;
DROP TABLE IF EXISTS public.perfiles CASCADE;

-- 2. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 3. TABLA: public.perfiles
-- Vinculada 1 a 1 con auth.users mediante UUID
-- ==============================================================================
CREATE TABLE public.perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    nombre_completo TEXT, -- Compatibilidad
    carrera TEXT DEFAULT 'Ingeniería de Software',
    semestre TEXT DEFAULT 'Semestre 2025-1',
    meta_horas_total NUMERIC(6,2) NOT NULL DEFAULT 360.00 CHECK (meta_horas_total > 0 AND meta_horas_total <= 1200),
    meta_horas INTEGER DEFAULT 360, -- Alias de compatibilidad
    horas_iniciales_previas NUMERIC(6,2) NOT NULL DEFAULT 0.00 CHECK (horas_iniciales_previas >= 0),
    horas_minimas_semanales NUMERIC(5,2) NOT NULL DEFAULT 30.00 CHECK (horas_minimas_semanales >= 0),
    perfil_completado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_inicio DATE,
    fecha_fin DATE,
    
    -- Horario Semanal Multidía en formato JSONB estructurado (Lunes a Domingo)
    horario_semanal JSONB NOT NULL DEFAULT '{
      "lunes":     { "diaSemana": "lunes",     "activo": true,  "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
      "martes":    { "diaSemana": "martes",    "activo": true,  "horaInicio": "14:00", "horaFin": "19:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
      "miercoles": { "diaSemana": "miercoles", "activo": true,  "horaInicio": "14:00", "horaFin": "19:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
      "jueves":    { "diaSemana": "jueves",    "activo": true,  "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
      "viernes":   { "diaSemana": "viernes",   "activo": true,  "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
      "sabado":    { "diaSemana": "sabado",    "activo": false, "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
      "domingo":   { "diaSemana": "domingo",   "activo": false, "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" }
    }'::jsonb,

    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),

    CONSTRAINT chk_fechas_convenio CHECK (fecha_inicio IS NULL OR fecha_fin IS NULL OR fecha_inicio <= fecha_fin)
);

CREATE INDEX idx_perfiles_email ON public.perfiles(email);

-- ==============================================================================
-- 4. TABLA: public.practicas (Gestión y Control de Prácticas Profesionales)
-- Soporta Estados (Borrador, Activa, Finalizada), Empresa, Período, Horas y Horario
-- ==============================================================================
CREATE TABLE public.practicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    empresa TEXT NOT NULL,
    cargo TEXT,
    supervisor_nombre TEXT,
    supervisor_email TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    total_horas_requeridas NUMERIC(6,2) NOT NULL DEFAULT 360.00 CHECK (total_horas_requeridas > 0 AND total_horas_requeridas <= 2000),
    horas_iniciales_previas NUMERIC(6,2) NOT NULL DEFAULT 0.00 CHECK (horas_iniciales_previas >= 0),
    horas_minimas_semanales NUMERIC(5,2) NOT NULL DEFAULT 30.00 CHECK (horas_minimas_semanales >= 0),
    horario_semanal JSONB NOT NULL DEFAULT '{
      "lunes":     { "diaSemana": "lunes",     "activo": true,  "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial", "horasPrevistasJornada": 5.0 },
      "martes":    { "diaSemana": "martes",    "activo": true,  "horaInicio": "14:00", "horaFin": "19:00", "refrigerioMinutos": 0, "modalidad": "Presencial", "horasPrevistasJornada": 5.0 },
      "miercoles": { "diaSemana": "miercoles", "activo": true,  "horaInicio": "14:00", "horaFin": "19:00", "refrigerioMinutos": 0, "modalidad": "Presencial", "horasPrevistasJornada": 5.0 },
      "jueves":    { "diaSemana": "jueves",    "activo": true,  "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial", "horasPrevistasJornada": 5.0 },
      "viernes":   { "diaSemana": "viernes",   "activo": true,  "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial", "horasPrevistasJornada": 5.0 },
      "sabado":    { "diaSemana": "sabado",    "activo": false, "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial", "horasPrevistasJornada": 0.0 },
      "domingo":   { "diaSemana": "domingo",   "activo": false, "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial", "horasPrevistasJornada": 0.0 }
    }'::jsonb,
    estado TEXT NOT NULL DEFAULT 'Activa' CHECK (estado IN ('Borrador', 'Activa', 'Finalizada')),
    fecha_inicio_real TIMESTAMPTZ,
    fecha_finalizacion_real TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),

    CONSTRAINT chk_practicas_fechas CHECK (fecha_inicio <= fecha_fin)
);

CREATE INDEX idx_practicas_user ON public.practicas(user_id);
CREATE INDEX idx_practicas_estado ON public.practicas(estado);

-- ==============================================================================
-- 5. TABLA: public.registros_horas (Jornadas Diarias de Práctica)
-- Admite IDs generados por el cliente (UUID v4) para soporte Offline-First
-- ==============================================================================
CREATE TABLE public.registros_horas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    descuento_almuerzo_min INTEGER NOT NULL DEFAULT 0 CHECK (descuento_almuerzo_min >= 0 AND descuento_almuerzo_min <= 180),
    horas_computables NUMERIC(5,2) NOT NULL CHECK (horas_computables >= 0 AND horas_computables <= 24),
    modalidad TEXT NOT NULL DEFAULT 'Presencial' CHECK (modalidad IN ('Presencial', 'Remoto', 'Híbrido')),
    actividades TEXT NOT NULL,
    supervisor_nombre TEXT,
    estado TEXT NOT NULL DEFAULT 'Aprobado' CHECK (estado IN ('Borrador', 'Pendiente', 'Aprobado', 'Observado')),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_registros_horas_user ON public.registros_horas(user_id);
CREATE INDEX idx_registros_horas_fecha ON public.registros_horas(fecha);
CREATE INDEX idx_registros_horas_deleted ON public.registros_horas(deleted_at);

-- ==============================================================================
-- 5. TABLA: public.intentos_login (Anti-Brute Force)
-- ==============================================================================
CREATE TABLE public.intentos_login (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    intentos_fallidos INTEGER NOT NULL DEFAULT 0,
    bloqueado_hasta TIMESTAMPTZ,
    ultimo_intento TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    ip_origen TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_intentos_login_email ON public.intentos_login(email);

-- ==============================================================================
-- 6. TABLA: public.tokens_recuperacion
-- ==============================================================================
CREATE TABLE public.tokens_recuperacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expira_en TIMESTAMPTZ NOT NULL,
    utilizado BOOLEAN NOT NULL DEFAULT FALSE,
    utilizado_en TIMESTAMPTZ,
    ip_solicitud TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_tokens_recuperacion_hash ON public.tokens_recuperacion(token_hash);
CREATE INDEX idx_tokens_recuperacion_user ON public.tokens_recuperacion(user_id);

-- ==============================================================================
-- 7. FUNCIONES Y TRIGGERS AUTOMÁTICOS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_perfiles_updated_at ON public.perfiles;
CREATE TRIGGER trg_perfiles_updated_at
    BEFORE UPDATE ON public.perfiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_registros_horas_updated_at ON public.registros_horas;
CREATE TRIGGER trg_registros_horas_updated_at
    BEFORE UPDATE ON public.registros_horas
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Crear perfil automáticamente al registrar usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    nombre_val TEXT;
BEGIN
    nombre_val := COALESCE(
        NEW.raw_user_meta_data->>'nombre',
        NEW.raw_user_meta_data->>'nombreCompleto',
        split_part(NEW.email, '@', 1)
    );

    INSERT INTO public.perfiles (
        id,
        email,
        nombre,
        nombre_completo,
        carrera,
        semestre,
        meta_horas_total,
        meta_horas,
        horas_iniciales_previas,
        horas_minimas_semanales,
        perfil_completado,
        fecha_inicio,
        fecha_fin,
        horario_semanal
    )
    VALUES (
        NEW.id,
        NEW.email,
        nombre_val,
        nombre_val,
        COALESCE(NEW.raw_user_meta_data->>'carrera', 'Ingeniería de Software'),
        COALESCE(NEW.raw_user_meta_data->>'semestre', 'Semestre 2025-1'),
        COALESCE((NEW.raw_user_meta_data->>'metaHorasTotal')::NUMERIC, (NEW.raw_user_meta_data->>'metaHoras')::NUMERIC, 360.00),
        COALESCE((NEW.raw_user_meta_data->>'metaHoras')::INTEGER, (NEW.raw_user_meta_data->>'metaHorasTotal')::INTEGER, 360),
        COALESCE((NEW.raw_user_meta_data->>'horasInicialesPrevias')::NUMERIC, 0.00),
        COALESCE((NEW.raw_user_meta_data->>'horasMinimasSemanales')::NUMERIC, 30.00),
        COALESCE((NEW.raw_user_meta_data->>'perfilCompletado')::BOOLEAN, FALSE),
        CASE WHEN NEW.raw_user_meta_data->>'fechaInicio' IS NOT NULL THEN (NEW.raw_user_meta_data->>'fechaInicio')::DATE ELSE NULL END,
        CASE WHEN NEW.raw_user_meta_data->>'fechaFin' IS NOT NULL THEN (NEW.raw_user_meta_data->>'fechaFin')::DATE ELSE NULL END,
        COALESCE((NEW.raw_user_meta_data->'horarioSemanal')::jsonb, '{
          "lunes":     { "diaSemana": "lunes",     "activo": true,  "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
          "martes":    { "diaSemana": "martes",    "activo": true,  "horaInicio": "14:00", "horaFin": "19:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
          "miercoles": { "diaSemana": "miercoles", "activo": true,  "horaInicio": "14:00", "horaFin": "19:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
          "jueves":    { "diaSemana": "jueves",    "activo": true,  "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
          "viernes":   { "diaSemana": "viernes",   "activo": true,  "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
          "sabado":    { "diaSemana": "sabado",    "activo": false, "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" },
          "domingo":   { "diaSemana": "domingo",   "activo": false, "horaInicio": "08:00", "horaFin": "13:00", "refrigerioMinutos": 0, "modalidad": "Presencial" }
        }'::jsonb)
    )
    ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        nombre_completo = EXCLUDED.nombre_completo,
        meta_horas_total = EXCLUDED.meta_horas_total,
        meta_horas = EXCLUDED.meta_horas,
        horario_semanal = EXCLUDED.horario_semanal;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 8. SEGURIDAD A NIVEL DE FILAS (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_horas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intentos_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens_recuperacion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura y edición de perfil propio" ON public.perfiles;
CREATE POLICY "Lectura y edición de perfil propio"
    ON public.perfiles
    FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Acceso total a registros de horas propios" ON public.registros_horas;
CREATE POLICY "Acceso total a registros de horas propios"
    ON public.registros_horas
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
