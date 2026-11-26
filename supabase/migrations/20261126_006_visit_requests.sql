-- Solicitudes de visita a remates
CREATE TABLE IF NOT EXISTS public.visit_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id      UUID REFERENCES public.auctions(id) ON DELETE SET NULL,
  auction_title   TEXT NOT NULL,
  lot_number      TEXT,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  message         TEXT,
  visit_date      DATE NOT NULL,
  visit_time      TEXT NOT NULL,
  visit_modality  TEXT NOT NULL CHECK (visit_modality IN ('Virtual', 'Presencial')),
  status          TEXT NOT NULL DEFAULT 'pendiente'
                  CHECK (status IN ('pendiente', 'contactado', 'confirmada', 'cancelada')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visit_requests_auction_id_idx ON public.visit_requests (auction_id);
CREATE INDEX IF NOT EXISTS visit_requests_email_idx ON public.visit_requests (lower(email));
CREATE INDEX IF NOT EXISTS visit_requests_user_id_idx ON public.visit_requests (user_id);
CREATE INDEX IF NOT EXISTS visit_requests_created_at_idx ON public.visit_requests (created_at DESC);

ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;

-- Lectura: el interesado (por user_id o email) o un administrador
CREATE POLICY "visit_requests_select_own_or_admin"
  ON public.visit_requests FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.jwt() ->> 'email') IS NOT NULL
       AND lower(email) = lower(auth.jwt() ->> 'email')
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Inserción pública (formulario de solicitud; la Edge Function también inserta con service role)
CREATE POLICY "visit_requests_insert_public"
  ON public.visit_requests FOR INSERT
  WITH CHECK (true);

-- Actualización de estado: solo administradores
CREATE POLICY "visit_requests_update_admin"
  ON public.visit_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );
