-- Agregar Número de Lote a subastas
ALTER TABLE public.auctions
  ADD COLUMN IF NOT EXISTS lot_number TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.auctions.lot_number IS 'Número de lote del remate';
