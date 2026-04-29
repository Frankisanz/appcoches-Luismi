-- =====================================================================================
-- MOTOR-CRM: SEED COMPLETO — STOCK REAL CON FOTOS PROFESIONALES
-- =====================================================================================

-- 1) Añadir columna imagen_url si no existe
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS imagen_url TEXT;

-- 2) Limpiamos stock previo
DELETE FROM public.vehiculos;

-- 3) Insertamos el stock real con las nuevas fotos profesionales
INSERT INTO public.vehiculos (marca, modelo, año, precio_venta, estado, imagen_url, detalles_extras)
VALUES
(
  'AUDI', 'A1 1.4 TDI 90CV ultra Attraction', 2015, 9900.00, 'disponible',
  '/images/coches/audi-a1.png',
  '{"slogan": "Compacto premium con el ADN de Audi. Consumo mínimo y estilo urbano inigualable.", "km": 160179, "combustible": "Diésel", "transmision": "Manual", "color": "Blanco", "localizacion": "Jaén"}'
),
(
  'BMW', 'X2 xDrive25e Auto', 2021, 30900.00, 'disponible',
  '/images/coches/bmw-x2.png',
  '{"slogan": "Estilo coupé SUV con etiqueta CERO. Tracción total e hibridación premium.", "km": 19124, "combustible": "Híbrido enchufable", "transmision": "Automático", "color": "Negro", "localizacion": "Jaén", "precio_financiado": 29900}'
),
(
  'BMW', 'Z4 sDrive20i', 2024, 43900.00, 'disponible',
  '/images/coches/bmw-z4.png',
  '{"slogan": "Pura emoción a cielo abierto. Diseño sublime y tracción trasera para disfrutar.", "km": 19320, "combustible": "Gasolina", "transmision": "Automático", "color": "Rojo", "localizacion": "Jaén", "precio_financiado": 41900}'
),
(
  'MERCEDES-BENZ', 'Clase A A 200 d', 2021, 19500.00, 'disponible',
  '/images/coches/mercedes-a200d.png',
  '{"slogan": "Lujo accesible con motorización diésel eficiente. Sistema MBUX de última generación.", "km": 185376, "combustible": "Diésel", "transmision": "Automático", "color": "Negro", "localizacion": "Jaén", "precio_financiado": 18900}'
),
(
  'VOLKSWAGEN', 'Tiguan Allspace Life 1.5 TSI DSG', 2024, 37900.00, 'disponible',
  '/images/coches/vw-tiguan-allspace.png',
  '{"slogan": "El SUV familiar definitivo: espacio, tecnología y el máximo confort del cambio DSG.", "km": 17905, "combustible": "Gasolina", "transmision": "Automático", "color": "Blanco puro", "localizacion": "Jaén", "precio_financiado": 36900}'
),
(
  'SEAT', 'Arona 1.0 TSI Style', 2020, 14900.00, 'disponible',
  '/images/coches/seat-arona.png',
  '{"slogan": "El crossover urbano perfecto. Diseño español, tecnología alemana.", "km": 55000, "combustible": "Gasolina", "transmision": "Manual", "color": "Azul", "localizacion": "Jaén"}'
),
(
  'TOYOTA', 'RAV4 2.5 220H Advance', 2022, 32000.00, 'disponible',
  '/images/coches/toyota-rav4.png',
  '{"slogan": "El SUV híbrido más vendido del mundo. Fiabilidad legendaria y etiqueta ECO.", "km": 28000, "combustible": "Híbrido", "transmision": "Automático", "color": "Gris Oscuro", "localizacion": "Jaén"}'
),
(
  'CITROËN', 'Grand C4 Picasso 1.6 HDi Millenium', 2011, 4900.00, 'disponible',
  '/images/coches/citroen-c4-picasso.png',
  '{"slogan": "Espacio familiar con motorización diésel eficiente.", "km": 243747, "combustible": "Diésel", "transmision": "Manual", "color": "Gris", "localizacion": "Jaén"}'
),
(
  'IVECO', 'Daily 2.3 TD 35S', 2021, 16500.00, 'disponible',
  '/images/coches/iveco-daily.png',
  '{"slogan": "Vehículo industrial con capacidad de carga excepcional.", "km": 367418, "combustible": "Diésel", "transmision": "Manual", "color": "Blanco", "localizacion": "Jaén"}'
),
(
  'MERCEDES-BENZ', 'Clase A 180 CDI AMG Line', 2013, 13900.00, 'disponible',
  '/images/coches/mercedes-a180-amg.png',
  '{"slogan": "Acabado AMG Line con la eficiencia del diésel BlueEFFICIENCY.", "km": 178318, "combustible": "Diésel", "transmision": "Automático", "color": "Blanco", "localizacion": "Jaén"}'
),
(
  'PEUGEOT', 'Partner TEPEE Active 1.6', 2015, 9500.00, 'disponible',
  '/images/coches/peugeot-partner.png',
  '{"slogan": "Versatilidad y espacio en un vehículo compacto ideal para la familia.", "km": 157549, "combustible": "Diésel", "transmision": "Manual", "color": "Blanco", "localizacion": "Jaén"}'
),
(
  'MERCEDES-BENZ', 'Clase C 220 BlueTEC', 2014, 14900.00, 'disponible',
  '/images/coches/mercedes-c220.png',
  '{"slogan": "La berlina ejecutiva por excelencia. Acabado Avantgarde.", "km": 175073, "combustible": "Diésel", "transmision": "Automático", "color": "Gris", "localizacion": "Jaén"}'
),
(
  'MERCEDES-BENZ', 'Clase S S 500', 2014, 32900.00, 'disponible',
  '/images/coches/mercedes-s500.png',
  '{"slogan": "El máximo exponente del lujo alemán. Presencia imponente.", "km": 223793, "combustible": "Gasolina", "transmision": "Automático", "color": "Negro", "localizacion": "Jaén"}'
),
(
  'FIAT', '500L 1.4 16v', 2013, 5900.00, 'disponible',
  '/images/coches/fiat-500l.png',
  '{"slogan": "El encanto italiano en formato familiar.", "km": 146951, "combustible": "Gasolina", "transmision": "Manual", "color": "Blanco", "localizacion": "Jaén"}'
);
