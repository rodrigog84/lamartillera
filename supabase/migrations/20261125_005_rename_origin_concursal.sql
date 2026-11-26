-- Renombrar origen "Concursal" → "Liquidación Concursal"
UPDATE public.auctions
SET origin = 'Liquidación Concursal'
WHERE origin = 'Concursal';
