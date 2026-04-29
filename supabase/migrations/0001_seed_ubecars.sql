-- =====================================================================================
-- SEED MOTOR-CRM (AUTOMOVILES LUISMI) - DATOS REALES DE UBECARS
-- =====================================================================================

INSERT INTO public.vehiculos (marca, modelo, año, precio_venta, estado, detalles_extras)
VALUES
  (
    'MERCEDES-BENZ', 
    'Clase B B 180 CDI', 
    2013, 
    10500, 
    'disponible', 
    '{"kilometros": 172351, "cambio": "Manual", "combustible": "Diésel", "localizacion": "Jaén", "slogan": "Fiabilidad alemana y consumo reducido. Un clase B perfecto para el día a día."}'::jsonb
  ),
  (
    'TOYOTA', 
    'C-HR 1.8 125H Style Plus', 
    2017, 
    15900, 
    'disponible', 
    '{"kilometros": 181944, "cambio": "Automático", "combustible": "Híbrido", "localizacion": "Jaén", "slogan": "La revolución del diseño híbrido. Etiqueta ECO, bajo consumo y estética espectacular."}'::jsonb
  ),
  (
    'HONDA', 
    'CR-V 1.6 i-DTEC 88kW 4x2 Eleg Pl Nav', 
    2018, 
    17500, 
    'disponible', 
    '{"kilometros": 125780, "cambio": "Manual", "combustible": "Diésel", "localizacion": "Jaén", "slogan": "Espacio y confort japoneses en un SUV incombustible. Ideal para la familia."}'::jsonb
  ),
  (
    'VOLKSWAGEN', 
    'Tiguan Allspace Life 1.5 TSI 110kW DSG', 
    2024, 
    38900, 
    'disponible', 
    '{"kilometros": 17905, "cambio": "Automático", "combustible": "Gasolina", "localizacion": "Jaén", "slogan": "Máxima versatilidad y espacio superior. Reestreno con cambio automático DSG."}'::jsonb
  ),
  (
    'BMW', 
    'X2 xDrive25e Auto', 
    2021, 
    30900, 
    'disponible', 
    '{"kilometros": 19124, "cambio": "Automático", "combustible": "Híbrido enchufable", "localizacion": "Jaén", "slogan": "Estilo coupé SUV con la etiqueta CERO. Tracción total e hibridación premium."}'::jsonb
  ),
  (
    'BMW', 
    'Z4 sDrive20i', 
    2024, 
    43900, 
    'disponible', 
    '{"kilometros": 19320, "cambio": "Automático", "combustible": "Gasolina", "localizacion": "Jaén", "slogan": "Pura emoción descapotable. Siente la brisa al volante del roadster más aclamado."}'::jsonb
  );
