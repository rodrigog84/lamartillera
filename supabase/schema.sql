-- ============================================================
-- La Martillera — Schema de base de datos
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- Tabla principal de subastas
CREATE TABLE IF NOT EXISTS auctions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  address       TEXT NOT NULL,
  commune       TEXT NOT NULL,
  region        TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('Inmuebles', 'Vehículos', 'Bienes Muebles')),
  property_type TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('Disponible', 'Adjudicada', 'Próximamente')),
  min_price     NUMERIC NOT NULL,
  currency      TEXT NOT NULL CHECK (currency IN ('CLP', 'UF')),
  guarantee     NUMERIC NOT NULL DEFAULT 0,
  auction_date  DATE NOT NULL,
  images        TEXT[]  DEFAULT '{}',
  description   TEXT NOT NULL DEFAULT '',
  surface       NUMERIC NOT NULL DEFAULT 0,
  bedrooms      INTEGER,
  bathrooms     INTEGER,
  parking_spaces INTEGER,
  occupation    TEXT NOT NULL DEFAULT 'Desocupada'
                CHECK (occupation IN ('Desocupada', 'Ocupada', 'Arrendada')),
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  external_registration_url TEXT NOT NULL DEFAULT '',
  -- Documentos legales (URLs a archivos en Storage)
  doc_bases     TEXT,
  doc_cdv       TEXT,
  doc_cav       TEXT,
  doc_gravamenes TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security ──
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer subastas (sitio público)
CREATE POLICY "Lectura pública de subastas"
  ON auctions FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden crear/editar/eliminar
CREATE POLICY "Admin puede gestionar subastas"
  ON auctions FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket para imágenes y documentos PDF
-- ============================================================

-- Ejecutar también en: Storage → New bucket
-- Nombre: "auction-files"
-- Public bucket: SÍ (para que los PDFs sean descargables sin login)

-- Política de lectura pública para el bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('auction-files', 'auction-files', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Lectura pública de archivos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'auction-files');

CREATE POLICY "Admin puede subir archivos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'auction-files' AND auth.role() = 'authenticated');

CREATE POLICY "Admin puede eliminar archivos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'auction-files' AND auth.role() = 'authenticated');
