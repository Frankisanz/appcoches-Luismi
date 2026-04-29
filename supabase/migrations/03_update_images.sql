-- =====================================================================================
-- MOTOR-CRM: ACTUALIZACIÓN DE IMÁGENES REALES DESDE UBECARS
-- =====================================================================================

UPDATE public.vehiculos 
SET imagen_url = 'https://storage.googleapis.com/vehicle-multipost-multimedia/3efcc9e1-a1bd-4645-944f-cd0cb9a40e32.jpeg' 
WHERE marca = 'MERCEDES-BENZ';

UPDATE public.vehiculos 
SET imagen_url = 'https://storage.googleapis.com/vehicle-multipost-multimedia/2c746773-2a51-44e6-807f-f3c2bf5017a8.jpeg' 
WHERE marca = 'TOYOTA';

UPDATE public.vehiculos 
SET imagen_url = 'https://storage.googleapis.com/vehicle-multipost-multimedia/487c344f-56ad-439c-a994-4501aa7c47dd.jpeg' 
WHERE marca = 'HONDA';

UPDATE public.vehiculos 
SET imagen_url = 'https://storage.googleapis.com/vehicle-multipost-multimedia/2a8feb37-ccfc-4412-9b40-721c08f308d6.jpeg' 
WHERE marca = 'VOLKSWAGEN';

UPDATE public.vehiculos 
SET imagen_url = 'https://storage.googleapis.com/vehicle-multipost-multimedia/462a89a4-5961-4f57-9d1b-3fdfa8ff7d01.jpeg' 
WHERE marca = 'BMW' AND modelo LIKE '%X2%';

UPDATE public.vehiculos 
SET imagen_url = 'https://storage.googleapis.com/vehicle-multipost-multimedia/71f1df63-22f4-4ed7-a740-f766b410549a.jpeg' 
WHERE marca = 'BMW' AND modelo LIKE '%Z4%';
