-- =====================================================================================
-- MOTOR-CRM: SEED COMPLETO — STOCK REAL CON IMÁGENES LOCALES
-- Ejecutar DESPUÉS de la migración initial_schema + add_imagen_url
-- =====================================================================================

-- 1) Añadir columna imagen_url si no existe (idempotente)
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS imagen_url TEXT;

-- 2) Limpiamos stock previo para un seed limpio
DELETE FROM public.vehiculos;

-- 3) Insertamos TODO el stock real (UBEcars + fotos locales que tenemos)
INSERT INTO public.vehiculos (marca, modelo, año, precio_venta, estado, imagen_url, detalles_extras)
VALUES
-- ── Coches con foto local ──────────────────────────────────────────────────────
(
  'Audi',
  'A1',
  2021,
  22000.00,
  'disponible',
  '/images/coches/Audi A1.jpg',
  '{"slogan": "Compacto premium con la esencia deportiva de Audi. Tecnología y estilo en cada detalle.", "km": 35000, "combustible": "Gasolina", "transmision": "Automático", "color": "Blanco"}'
),
(
  'BMW',
  'X2 xDrive25e Auto',
  2021,
  30900.00,
  'disponible',
  '/images/coches/BMW X2.jpg',
  '{"slogan": "Deportividad BMW X con las ventajas ecológicas de un híbrido enchufable. Etiqueta CERO.", "km": 19124, "combustible": "Híbrido enchufable", "transmision": "Automático", "color": "Negro"}'
),
(
  'BMW',
  'Z4 sDrive20i',
  2024,
  43900.00,
  'disponible',
  '/images/coches/BMW Z4.jpg',
  '{"slogan": "Pura emoción a cielo abierto. Diseño sublime y tracción trasera para disfrutar conducir.", "km": 19320, "combustible": "Gasolina", "transmision": "Automático", "color": "Rojo"}'
),
(
  'Toyota',
  'RAV4',
  2022,
  32000.00,
  'disponible',
  '/images/coches/Toyota Rav4.jpg',
  '{"slogan": "El SUV híbrido más vendido del mundo. Fiabilidad legendaria y etiqueta ECO.", "km": 28000, "combustible": "Híbrido", "transmision": "Automático", "color": "Gris Oscuro"}'
),
(
  'Mercedes-Benz',
  'Clase A 200d',
  2021,
  29000.00,
  'disponible',
  '/images/coches/mercedes-benz clase A 200d.jpg',
  '{"slogan": "Lujo accesible con motorización diésel eficiente. Sistema MBUX de última generación.", "km": 42000, "combustible": "Diésel", "transmision": "Automático", "color": "Negro"}'
),
(
  'Seat',
  'Arona',
  2020,
  16000.00,
  'disponible',
  '/images/coches/seat arona.jpg',
  '{"slogan": "El crossover urbano perfecto. Diseño español, tecnología alemana y precio imbatible.", "km": 55000, "combustible": "Gasolina", "transmision": "Manual", "color": "Azul"}'
),
(
  'Volkswagen',
  'Tiguan Allspace Life 1.5 TSI DSG',
  2024,
  38900.00,
  'disponible',
  '/images/coches/volkswagen tiguan allspace.jpg',
  '{"slogan": "El SUV familiar definitivo: espacio, tecnología y el máximo confort del cambio DSG.", "km": 17905, "combustible": "Gasolina", "transmision": "Automático", "color": "Blanco puro"}'
),

-- ── Coches del stock original sin foto local (imagen remota) ───────────────────
(
  'Mercedes-Benz',
  'Clase B 180 CDI',
  2013,
  10500.00,
  'disponible',
  'https://storage.googleapis.com/vehicle-multipost-multimedia/3efcc9e1-a1bd-4645-944f-cd0cb9a40e32.jpeg',
  '{"slogan": "Fiabilidad alemana y consumo mínimo para tu día a día.", "km": 172351, "combustible": "Diésel", "transmision": "Manual", "color": "Negro"}'
),
(
  'Toyota',
  'C-HR 1.8 125H Style Plus',
  2017,
  15900.00,
  'disponible',
  'https://storage.googleapis.com/vehicle-multipost-multimedia/2c746773-2a51-44e6-807f-f3c2bf5017a8.jpeg',
  '{"slogan": "Tecnología híbrida líder, diseño rompedor y etiqueta ECO.", "km": 181944, "combustible": "Híbrido", "transmision": "Automático", "color": "Blanco"}'
),
(
  'Honda',
  'CR-V 1.6 i-DTEC 120CV Elegance Nav',
  2018,
  17500.00,
  'disponible',
  'https://storage.googleapis.com/vehicle-multipost-multimedia/487c344f-56ad-439c-a994-4501aa7c47dd.jpeg',
  '{"slogan": "Un SUV incombustible con motor diésel eterno y confort excepcional.", "km": 125780, "combustible": "Diésel", "transmision": "Manual", "color": "Gris"}'
);
