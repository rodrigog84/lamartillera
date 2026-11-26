-- Visitas al bien: lista de { date, time, modality }
ALTER TABLE public.auctions
  ADD COLUMN IF NOT EXISTS visits JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.auctions.visits IS
  'Array JSON de visitas: [{ "date": "YYYY-MM-DD", "time": "HH:mm", "modality": "Virtual"|"Presencial" }]';
