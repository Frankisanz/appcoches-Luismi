-- =====================================================================================
-- MOTOR-CRM: POLÍTICAS RLS (Row Level Security)
-- =====================================================================================

-- 1. VEHÍCULOS: Todo el mundo (público y autenticados) puede VER el catálogo.
CREATE POLICY "Vehículos son públicos para lectura"
ON public.vehiculos
FOR SELECT
USING (true);

-- Sólo los usuarios autenticados pueden modificar los vehículos.
CREATE POLICY "Sólo agentes pueden modificar vehículos"
ON public.vehiculos
FOR ALL
USING (auth.role() = 'authenticated');


-- 2. LEADS: Sólo los usuarios autenticados pueden ver y gestionar leads.
CREATE POLICY "Agentes pueden ver y modificar leads"
ON public.leads
FOR ALL
USING (auth.role() = 'authenticated');


-- 3. MENSAJES: Sólo los usuarios autenticados pueden leer y enviar mensajes.
CREATE POLICY "Agentes pueden ver y enviar mensajes"
ON public.mensajes
FOR ALL
USING (auth.role() = 'authenticated');


-- 4. USUARIOS: Los agentes pueden ver a otros usuarios (para asignar leads, etc).
CREATE POLICY "Agentes pueden ver perfiles de usuarios"
ON public.usuarios
FOR SELECT
USING (auth.role() = 'authenticated');
