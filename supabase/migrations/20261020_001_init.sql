-- =============================================================
-- La Martillera — Migración inicial
-- =============================================================

-- ── 1. TABLA: auctions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.auctions (
  id                      UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title                   TEXT        NOT NULL,
  address                 TEXT        NOT NULL DEFAULT '',
  commune                 TEXT        NOT NULL DEFAULT '',
  region                  TEXT        NOT NULL DEFAULT '',
  category                TEXT        NOT NULL DEFAULT 'Inmuebles',
  property_type           TEXT        NOT NULL DEFAULT 'Casa',
  status                  TEXT        NOT NULL DEFAULT 'Disponible',
  min_price               NUMERIC     NOT NULL DEFAULT 0,
  currency                TEXT        NOT NULL DEFAULT 'UF',
  guarantee               NUMERIC     NOT NULL DEFAULT 0,
  auction_date            DATE        NOT NULL,
  images                  TEXT[]      DEFAULT '{}',
  description             TEXT        DEFAULT '',
  surface                 NUMERIC     NOT NULL DEFAULT 0,
  bedrooms                INTEGER,
  bathrooms               INTEGER,
  parking_spaces          INTEGER,
  occupation              TEXT        NOT NULL DEFAULT 'Desocupada',
  origin                  TEXT        NOT NULL DEFAULT 'Privado',
  featured                BOOLEAN     NOT NULL DEFAULT FALSE,
  external_registration_url TEXT      DEFAULT '',
  doc_bases               TEXT,
  doc_cdv                 TEXT,
  doc_cav                 TEXT,
  doc_gravamenes          TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auctions_public_read"
  ON public.auctions FOR SELECT USING (true);

CREATE POLICY "auctions_authenticated_write"
  ON public.auctions FOR ALL USING (auth.role() = 'authenticated');


-- ── 2. TABLA: profiles ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name       TEXT        NOT NULL DEFAULT '',
  phone      TEXT,
  is_admin   BOOLEAN     DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read_own"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_write_own"
  ON public.profiles FOR ALL USING (auth.uid() = id);


-- ── 3. TABLA: user_favorites ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id    UUID REFERENCES auth.users(id)      ON DELETE CASCADE,
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, auction_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_own"
  ON public.user_favorites FOR ALL USING (auth.uid() = user_id);


-- ── 4. TRIGGER: crear perfil al registrar usuario ─────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 5. DATOS DE MUESTRA ───────────────────────────────────────
-- UUIDs fijos para que los links directos sean estables

INSERT INTO public.auctions (
  id, title, address, commune, region, category, property_type, status,
  min_price, currency, guarantee, auction_date, images, description,
  surface, bedrooms, bathrooms, parking_spaces, occupation, origin,
  featured, external_registration_url, doc_bases, created_at
) VALUES

-- Inmuebles Disponibles
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Departamento céntrico con vista panorámica',
  'Av. Providencia 1234, Depto. 801', 'Providencia', 'RM - Metropolitana',
  'Inmuebles', 'Departamento', 'Disponible',
  3200, 'UF', 4000000, '2027-03-15',
  ARRAY[
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
  ],
  'Hermoso departamento de 3 dormitorios y 2 baños en el corazón de Providencia. Amplio living-comedor, cocina equipada, terraza con vista a la cordillera. Edificio con portería 24 horas, piscina y gimnasio.',
  85, 3, 2, 1, 'Desocupada', 'Privado', true,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-06-01T10:00:00Z'
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Casa familiar en tranquilo barrio residencial',
  'Los Arrayanes 456', 'Las Condes', 'RM - Metropolitana',
  'Inmuebles', 'Casa', 'Disponible',
  8500, 'UF', 8000000, '2027-03-15',
  ARRAY[
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'
  ],
  'Amplia casa de dos pisos en barrio residencial exclusivo. 4 dormitorios, 3 baños, patio trasero con jardín. Perfecta para familia que busca tranquilidad con acceso a todos los servicios.',
  180, 4, 3, 2, 'Desocupada', 'Privado', true,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-06-02T10:00:00Z'
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Parcela con vista al lago, ideal turismo',
  'Camino Los Lagos Km 12', 'Puerto Varas', 'X - Los Lagos',
  'Inmuebles', 'Parcela', 'Disponible',
  1200, 'UF', 2000000, '2027-03-29',
  ARRAY[
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
  ],
  'Hermosa parcela de 5.000 m² con vista directa al lago Llanquihue y el volcán Osorno. Ideal para proyecto turístico o residencia de descanso. Acceso pavimentado, agua potable disponible.',
  5000, NULL, NULL, NULL, 'Desocupada', 'Privado', true,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-06-03T10:00:00Z'
),
(
  'a1b2c3d4-0004-4000-8000-000000000004',
  'Local comercial en pleno centro histórico',
  'Paseo Ahumada 321, Local 5', 'Santiago', 'RM - Metropolitana',
  'Inmuebles', 'Local Comercial', 'Disponible',
  45000000, 'CLP', 5000000, '2027-04-05',
  ARRAY['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80'],
  'Local comercial de 120 m² en pleno Paseo Ahumada, sector de alto tráfico peatonal. Incluye bodega y baño. Gran oportunidad de inversión.',
  120, NULL, NULL, NULL, 'Arrendada', 'Judicial', false,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-06-04T10:00:00Z'
),
(
  'a1b2c3d4-0005-4000-8000-000000000005',
  'Oficina ejecutiva en torre corporativa',
  'Av. El Bosque Norte 500, Of. 1201', 'Las Condes', 'RM - Metropolitana',
  'Inmuebles', 'Oficina', 'Próximamente',
  2800, 'UF', 4000000, '2027-05-05',
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
  'Moderna oficina de 65 m² en emblemática torre del sector financiero. Planta libre, aire acondicionado, metro cercano.',
  65, NULL, NULL, NULL, 'Desocupada', 'Privado', false,
  'https://lamartillera.cl/registro',
  NULL,
  '2026-06-05T10:00:00Z'
),

-- Inmuebles Adjudicados
(
  'a1b2c3d4-0006-4000-8000-000000000006',
  'Bodega industrial sector norte — ADJUDICADA',
  'Av. Lo Boza 1200, Bodega C', 'Pudahuel', 'RM - Metropolitana',
  'Inmuebles', 'Bodega', 'Adjudicada',
  6200, 'UF', 6000000, '2026-06-20',
  ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'],
  'Bodega industrial de 800 m² con altura libre de 8 m, acceso a camiones, portón eléctrico y oficina. Subasta adjudicada exitosamente.',
  800, NULL, NULL, NULL, 'Desocupada', 'Judicial', false,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-05-10T10:00:00Z'
),
(
  'a1b2c3d4-0007-4000-8000-000000000007',
  'Casa en condominio cerrado sector oriente — ADJUDICADA',
  'Condominio Los Peumos, Casa 14', 'La Florida', 'RM - Metropolitana',
  'Inmuebles', 'Casa', 'Adjudicada',
  4800, 'UF', 5000000, '2026-05-28',
  ARRAY[
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'
  ],
  'Casa de 3 dormitorios y 2 baños en condominio cerrado con vigilancia 24h. 110 m² construidos. Proceso de adjudicación completado.',
  110, 3, 2, 2, 'Desocupada', 'Judicial', false,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-04-20T10:00:00Z'
),

-- Vehículos
(
  'a1b2c3d4-0008-4000-8000-000000000008',
  'Camioneta Toyota Hilux 4x4 2020',
  'Depósito judicial, Av. Industrial 900', 'Pudahuel', 'RM - Metropolitana',
  'Vehículos', 'Camioneta', 'Disponible',
  12500000, 'CLP', 1500000, '2027-03-12',
  ARRAY[
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80'
  ],
  'Camioneta Toyota Hilux 4x4 doble cabina, año 2020, motor 2.8 diésel, 95.000 km. Color blanco. Incluye documentación al día.',
  0, NULL, NULL, NULL, 'Desocupada', 'Judicial', true,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-06-10T10:00:00Z'
),
(
  'a1b2c3d4-0009-4000-8000-000000000009',
  'Automóvil Chevrolet Cruze 2019',
  'Depósito judicial, Av. Industrial 900', 'Pudahuel', 'RM - Metropolitana',
  'Vehículos', 'Auto', 'Disponible',
  6800000, 'CLP', 800000, '2027-03-12',
  ARRAY[
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
    'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80'
  ],
  'Chevrolet Cruze LTZ 2019, motor 1.4 turbo, 68.000 km. Color gris oscuro. Mantenciones al día.',
  0, NULL, NULL, NULL, 'Desocupada', 'Concursal', false,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-06-11T10:00:00Z'
),

-- Bienes Muebles
(
  'a1b2c3d4-0010-4000-8000-000000000010',
  'Lote de equipamiento gastronómico completo',
  'Ex restaurante, Av. Vitacura 3800', 'Vitacura', 'RM - Metropolitana',
  'Bienes Muebles', 'Lote Mixto', 'Disponible',
  4200000, 'CLP', 500000, '2027-03-20',
  ARRAY[
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80'
  ],
  'Lote completo de equipamiento para restaurante: cocinas industriales, refrigeradores, vajilla para 80 personas, muebles de salón. Todo en buen estado.',
  0, NULL, NULL, NULL, 'Desocupada', 'Concursal', true,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-06-13T10:00:00Z'
),
(
  'a1b2c3d4-0011-4000-8000-000000000011',
  'Equipos médicos clínica — ADJUDICADO',
  'Ex Clínica Central, Av. Independencia 1027', 'Independencia', 'RM - Metropolitana',
  'Bienes Muebles', 'Lote Mixto', 'Adjudicada',
  9500000, 'CLP', 1000000, '2026-05-15',
  ARRAY['https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80'],
  'Lote de equipos médicos: ecógrafos, camas hospitalarias, monitores multiparamétricos y equipos de esterilización. Proceso adjudicado exitosamente.',
  0, NULL, NULL, NULL, 'Desocupada', 'Concursal', false,
  'https://lamartillera.cl/registro',
  'https://www.africau.edu/images/default/sample.pdf',
  '2026-04-10T10:00:00Z'
)

ON CONFLICT (id) DO NOTHING;
