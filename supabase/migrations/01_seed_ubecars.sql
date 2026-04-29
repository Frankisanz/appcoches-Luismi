-- =====================================================================================
-- MOTOR-CRM: SEED DE VEHÍCULOS (STOCK REAL DESDE UBECARS)
-- =====================================================================================

-- Eliminamos los coches actuales (si existiera alguno de prueba) para empezar limpios
DELETE FROM public.vehiculos;

-- Insertamos el stock real extraído de ubecars.com
INSERT INTO public.vehiculos (marca, modelo, año, precio_venta, estado, detalles_extras)
VALUES 
(
  'MERCEDES-BENZ', 
  'Clase B 180 CDI', 
  2013, 
  10500.00, 
  'disponible', 
  '{"slogan": "Fiabilidad alemana y consumo mínimo para tu día a día.", "km": 172351, "combustible": "Diésel", "transmision": "Manual", "color": "Negro"}'
),
(
  'TOYOTA', 
  'C-HR 1.8 125H Style Plus', 
  2017, 
  15900.00, 
  'disponible', 
  '{"slogan": "Tecnología híbrida líder, diseño rompedor y etiqueta ECO para la ciudad.", "km": 181944, "combustible": "Híbrido", "transmision": "Automático", "color": "Blanco"}'
),
(
  'HONDA', 
  'CR-V 1.6 i-DTEC 120CV Elegance Nav', 
  2018, 
  17500.00, 
  'disponible', 
  '{"slogan": "Un SUV incombustible con un motor diésel eterno y un confort excepcional.", "km": 125780, "combustible": "Diésel", "transmision": "Manual", "color": "Gris"}'
),
(
  'VOLKSWAGEN', 
  'Tiguan Allspace Life 1.5 TSI DSG', 
  2024, 
  38900.00, 
  'disponible', 
  '{"slogan": "El SUV familiar definitivo: espacio, tecnología y el máximo confort del cambio DSG.", "km": 17905, "combustible": "Gasolina", "transmision": "Automático", "color": "Blanco puro"}'
),
(
  'BMW', 
  'X2 xDrive25e Auto', 
  2021, 
  30900.00, 
  'disponible', 
  '{"slogan": "Deportividad BMW X con todas las ventajas ecológicas y autonomía de un híbrido enchufable.", "km": 19124, "combustible": "Híbrido enchufable", "transmision": "Automático", "color": "Negro"}'
),
(
  'BMW', 
  'Z4 sDrive20i', 
  2024, 
  43900.00, 
  'disponible', 
  '{"slogan": "Pura emoción a cielo abierto. Diseño sublime y tracción trasera para disfrutar conducir.", "km": 19320, "combustible": "Gasolina", "transmision": "Automático", "color": "Rojo"}'
);
