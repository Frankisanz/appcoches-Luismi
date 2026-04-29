-- =====================================================================================
-- MOTOR-CRM: SCHEMAS DE BASE DE DATOS (SUPABASE / POSTGRESQL)
-- =====================================================================================

-- 1. EXTENSIONES
-- Habilitamos pgcrypto para UUIDs si no está habilitado
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
-- Son útiles para mantener integridad en estados que sabemos cerrados.
CREATE TYPE rol_usuario AS ENUM ('admin', 'vendedor');
CREATE TYPE estado_vehiculo AS ENUM ('disponible', 'reservado', 'vendido', 'importando');
CREATE TYPE estado_lead AS ENUM ('nuevo', 'en_contacto', 'visita_programada', 'negociacion', 'ganado', 'perdido');
CREATE TYPE remitente_mensaje AS ENUM ('cliente', 'agente', 'bot');
CREATE TYPE canal_mensaje AS ENUM ('whatsapp', 'email', 'sms');

-- 3. TABLAS

-- TABLA: USUARIOS
-- Conectada conceptualmente con auth.users de Supabase (por el id)
CREATE TABLE public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol rol_usuario DEFAULT 'vendedor'::rol_usuario NOT NULL,
    avatar_url TEXT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLA: VEHÍCULOS
CREATE TABLE public.vehiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    año INTEGER NOT NULL,
    vin TEXT UNIQUE, -- Número de bastidor
    precio_oferta DECIMAL(12,2), -- Precio de compra estimado/real
    precio_venta DECIMAL(12,2) NOT NULL, -- Precio cara al cliente
    estado estado_vehiculo DEFAULT 'disponible'::estado_vehiculo NOT NULL,
    detalles_extras JSONB DEFAULT '{}'::jsonb, -- Características adicionales
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actualizado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TABLA: LEADS (Oportunidades Funcionales para el Kanban)
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_cliente TEXT NOT NULL,
    telefono TEXT, -- Importante para WhatsApp Webhooks
    email TEXT,
    estado_kanban estado_lead DEFAULT 'nuevo'::estado_lead NOT NULL,
    vehiculo_interes_id UUID REFERENCES public.vehiculos(id) ON DELETE SET NULL,
    asignado_a UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    fuente TEXT, -- Ejemplo: 'Campaña FB', 'WhatsApp Directo'
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actualizado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexamos el teléfono para búsquedas rápidas cuando entra un webhook
CREATE INDEX idx_leads_telefono ON public.leads(telefono);

-- TABLA: MENSAJES (Para Bandeja de Entrada Unificada)
CREATE TABLE public.mensajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    remitente remitente_mensaje NOT NULL,
    canal canal_mensaje DEFAULT 'whatsapp'::canal_mensaje NOT NULL,
    mensaje_texto TEXT,
    media_url TEXT, -- URL si hay imágenes/documentos adjuntos
    leido BOOLEAN DEFAULT false NOT NULL,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexamos por lead para traer los chats rápido
CREATE INDEX idx_mensajes_lead_id ON public.mensajes(lead_id);

-- 4. SEGURIDAD A NIVEL DE FILAS (RLS) - Opcional pero recomendado en Supabase
-- Activamos RLS en todas las tablas por defecto
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes ENABLE ROW LEVEL SECURITY;

-- Nota: Habría que configurar las políticas de Supabase específicas una vez la app esté conectada,
-- por ahora dejamos habilitado RLS (sólo accederán vía Server u Ocultando los roles para el prototipo).
