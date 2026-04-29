-- =====================================================================================
-- MOTOR-CRM: SEED COMPLETO — STOCK REAL DESDE UBECARS.COM (Abril 2026)
-- Ejecutar en Supabase SQL Editor
-- =====================================================================================

-- 1) Añadir columna imagen_url si no existe
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS imagen_url TEXT;

-- 2) Limpiamos stock previo
DELETE FROM public.vehiculos;

-- 3) Insertamos TODOS los coches reales de ubecars.com con fotos locales donde las tenemos
INSERT INTO public.vehiculos (marca, modelo, año, precio_venta, estado, imagen_url, detalles_extras)
VALUES
-- ── Coches CON foto local (de la carpeta public/images/coches/) ────────────────

-- AUDI A1 — Datos exactos de ubecars.com
(
  'AUDI',
  'A1 1.4 TDI 90CV ultra Attraction',
  2015,
  9900.00,
  'disponible',
  '/images/coches/Audi A1.jpg',
  '{"slogan": "Compacto premium con el ADN de Audi. Consumo mínimo y estilo urbano inigualable.", "km": 160179, "combustible": "Diésel", "transmision": "Manual", "color": "Blanco", "localizacion": "Jaén", "precio_financiado": null}'
),

-- BMW X2 — Datos exactos de ubecars.com
(
  'BMW',
  'X2 xDrive25e Auto',
  2021,
  30900.00,
  'disponible',
  '/images/coches/BMW X2.jpg',
  '{"slogan": "Estilo coupé SUV con etiqueta CERO. Tracción total e hibridación premium.", "km": 19124, "combustible": "Híbrido enchufable", "transmision": "Automático", "color": "Negro", "localizacion": "Jaén", "precio_financiado": 29900}'
),

-- BMW Z4 — Datos exactos de ubecars.com
(
  'BMW',
  'Z4 sDrive20i',
  2024,
  43900.00,
  'disponible',
  '/images/coches/BMW Z4.jpg',
  '{"slogan": "Pura emoción a cielo abierto. Diseño sublime y tracción trasera para disfrutar.", "km": 19320, "combustible": "Gasolina", "transmision": "Automático", "color": "Rojo", "localizacion": "Jaén", "precio_financiado": 41900}'
),

-- MERCEDES-BENZ Clase A 200d — Datos exactos de ubecars.com
(
  'MERCEDES-BENZ',
  'Clase A A 200 d',
  2021,
  19500.00,
  'disponible',
  '/images/coches/mercedes-benz clase A 200d.jpg',
  '{"slogan": "Lujo accesible con motorización diésel eficiente. Sistema MBUX de última generación.", "km": 185376, "combustible": "Diésel", "transmision": "Automático", "color": "Negro", "localizacion": "Jaén", "precio_financiado": 18900}'
),

-- VOLKSWAGEN Tiguan Allspace — Datos exactos de ubecars.com
(
  'VOLKSWAGEN',
  'Tiguan Allspace Life 1.5 TSI 110kW (150CV) DSG',
  2024,
  37900.00,
  'disponible',
  '/images/coches/volkswagen tiguan allspace.jpg',
  '{"slogan": "El SUV familiar definitivo: espacio, tecnología y el máximo confort del cambio DSG.", "km": 17905, "combustible": "Gasolina", "transmision": "Automático", "color": "Blanco puro", "localizacion": "Jaén", "precio_financiado": 36900}'
),

-- SEAT Arona — No listado actualmente en ubecars (posiblemente vendido), datos estimados
(
  'SEAT',
  'Arona 1.0 TSI Style',
  2020,
  14900.00,
  'disponible',
  '/images/coches/seat arona.jpg',
  '{"slogan": "El crossover urbano perfecto. Diseño español, tecnología alemana y precio imbatible.", "km": 55000, "combustible": "Gasolina", "transmision": "Manual", "color": "Azul", "localizacion": "Jaén", "precio_financiado": null}'
),

-- TOYOTA RAV4 — No listado actualmente en ubecars (posiblemente vendido), datos estimados
(
  'TOYOTA',
  'RAV4 2.5 220H Advance',
  2022,
  32000.00,
  'disponible',
  '/images/coches/Toyota Rav4.jpg',
  '{"slogan": "El SUV híbrido más vendido del mundo. Fiabilidad legendaria y etiqueta ECO.", "km": 28000, "combustible": "Híbrido", "transmision": "Automático", "color": "Gris Oscuro", "localizacion": "Jaén", "precio_financiado": null}'
),

-- ── Coches SIN foto local (resto del stock de ubecars.com) ─────────────────────

(
  'CITROËN',
  'Grand C4 Picasso 1.6 HDi 110cv Millenium',
  2011,
  4900.00,
  'disponible',
  NULL,
  '{"slogan": "Espacio familiar con motorización diésel eficiente. El monovolumen que lo tiene todo.", "km": 243747, "combustible": "Diésel", "transmision": "Manual", "color": "Gris", "localizacion": "Jaén", "precio_financiado": null}'
),

(
  'IVECO',
  'Daily 2.3 TD 35S 16 V 3520/H2 10,8 M3',
  2021,
  16500.00,
  'disponible',
  NULL,
  '{"slogan": "Vehículo industrial con capacidad de carga excepcional para tu negocio.", "km": 367418, "combustible": "Diésel", "transmision": "Manual", "color": "Blanco", "localizacion": "Jaén", "precio_financiado": null}'
),

(
  'MERCEDES-BENZ',
  'Clase A A 180 CDI BlueEFFICIENCY DCT AMG Line',
  2013,
  13900.00,
  'disponible',
  NULL,
  '{"slogan": "Acabado AMG Line con la eficiencia del diésel BlueEFFICIENCY. Deportividad elegante.", "km": 178318, "combustible": "Diésel", "transmision": "Automático", "color": "Blanco", "localizacion": "Jaén", "precio_financiado": null}'
),

(
  'PEUGEOT',
  'Partner TEPEE Active 1.6 BlueHDi 100',
  2015,
  9500.00,
  'disponible',
  NULL,
  '{"slogan": "Versatilidad y espacio en un vehículo compacto ideal para la familia.", "km": 157549, "combustible": "Diésel", "transmision": "Manual", "color": "Blanco", "localizacion": "Jaén", "precio_financiado": null}'
),

(
  'MERCEDES-BENZ',
  'Clase C C 220 BlueTEC Avantgarde',
  2014,
  14900.00,
  'disponible',
  NULL,
  '{"slogan": "La berlina ejecutiva por excelencia. Acabado Avantgarde con motor BlueTEC.", "km": 175073, "combustible": "Diésel", "transmision": "Automático", "color": "Gris", "localizacion": "Jaén", "precio_financiado": null}'
),

(
  'MERCEDES-BENZ',
  'Clase S S 500',
  2014,
  32900.00,
  'disponible',
  NULL,
  '{"slogan": "El máximo exponente del lujo alemán. Presencia imponente y tecnología sin igual.", "km": 223793, "combustible": "Gasolina", "transmision": "Automático", "color": "Negro", "localizacion": "Jaén", "precio_financiado": null}'
),

(
  'FIAT',
  '500L 1.4 16v 95 CV',
  2013,
  5900.00,
  'disponible',
  NULL,
  '{"slogan": "El encanto italiano en formato familiar. Diseño icónico con espacio de sobra.", "km": 146951, "combustible": "Gasolina", "transmision": "Manual", "color": "Blanco", "localizacion": "Jaén", "precio_financiado": null}'
);
