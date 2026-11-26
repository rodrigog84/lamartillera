-- Separar Bases del Remate en Bases Generales y Bases Específicas
-- doc_bases existente se mantiene como Bases Generales
ALTER TABLE public.auctions
  ADD COLUMN IF NOT EXISTS doc_bases_especificas TEXT;

COMMENT ON COLUMN public.auctions.doc_bases IS 'URL PDF Bases Generales del remate';
COMMENT ON COLUMN public.auctions.doc_bases_especificas IS 'URL PDF Bases Específicas del remate';
