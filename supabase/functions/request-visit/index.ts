import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
/** Destino temporal de pruebas para notificaciones a La Martillera */
const ADMIN_EMAIL  = 'rodrigo.gonzalez@arnou.cl';
const SENDER_NAME  = 'La Martillera';
const SENDER_EMAIL = 'contacto@lamartillera.cl';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendEmail(to: string, toName: string, subject: string, html: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo error: ${err}`);
  }
}

serve(async (req) => {
  const year = new Date().getFullYear();

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      message,
      auctionId,
      auctionTitle,
      lotNumber,
      visitDate,
      visitTime,
      visitModality,
      userId,
    } = body;

    if (!name || !email || !phone || !auctionId || !auctionTitle || !visitDate || !visitTime || !visitModality) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos (incluye teléfono).' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (visitModality !== 'Virtual' && visitModality !== 'Presencial') {
      return new Response(JSON.stringify({ error: 'Modalidad inválida.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Persistir solicitud para cliente y administración
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error: dbError } = await admin.from('visit_requests').insert({
        auction_id: auctionId,
        auction_title: auctionTitle,
        lot_number: lotNumber || null,
        user_id: userId || null,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        message: message ? String(message).trim() : null,
        visit_date: visitDate,
        visit_time: visitTime,
        visit_modality: visitModality,
        status: 'pendiente',
      });
      if (dbError) {
        console.error('visit_requests insert error', dbError);
        throw new Error(`No se pudo guardar la solicitud: ${dbError.message}`);
      }
    }

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: phone ? escapeHtml(phone) : '',
      message: message ? escapeHtml(message) : '',
      auctionTitle: escapeHtml(auctionTitle),
      lotNumber: lotNumber ? escapeHtml(String(lotNumber)) : '',
      visitDate: escapeHtml(visitDate),
      visitTime: escapeHtml(visitTime),
      visitModality: escapeHtml(visitModality),
      auctionId: escapeHtml(auctionId),
    };

    const visitLabel = `${safe.visitDate} · ${safe.visitTime} hrs · ${safe.visitModality}`;
    const lotLabel = safe.lotNumber ? `Lote ${safe.lotNumber} — ` : '';

    // 1. Notificación a La Martillera
    await sendEmail(
      ADMIN_EMAIL,
      'La Martillera',
      `[Visita] ${safe.visitModality} — ${lotLabel}${safe.auctionTitle}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f8;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #4a1a6b 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #f0c040; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 2px;">LA MARTILLERA</h1>
          <p style="color: #c8a8e0; font-size: 12px; margin: 4px 0 0;">Nueva solicitud de visita</p>
        </div>
        <div style="background: #fff; padding: 40px;">
          <p style="color: #555; font-size: 14px; margin: 0 0 20px;">
            Un interesado solicitó una visita para el remate:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #444;">
            <tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f; width: 140px;">Remate</td><td style="padding: 8px 0;">${safe.auctionTitle}</td></tr>
            ${safe.lotNumber ? `<tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f;">Lote</td><td style="padding: 8px 0;">${safe.lotNumber}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f;">ID</td><td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${safe.auctionId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f;">Visita</td><td style="padding: 8px 0;"><strong>${visitLabel}</strong></td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-weight: 700; color: #1e3a5f; margin: 0 0 12px;">Datos del cliente</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #444;">
            <tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f; width: 140px;">Nombre</td><td style="padding: 8px 0;">${safe.name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f;">Email</td><td style="padding: 8px 0;"><a href="mailto:${safe.email}" style="color: #4a1a6b;">${safe.email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f;">Teléfono / WhatsApp</td><td style="padding: 8px 0;">${safe.phone}</td></tr>
          </table>
          ${safe.message ? `
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-weight: 700; color: #1e3a5f; margin: 0 0 8px;">Mensaje:</p>
          <p style="color: #555; line-height: 1.7; margin: 0; white-space: pre-wrap;">${safe.message}</p>
          ` : ''}
          <div style="margin-top: 24px; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="mailto:${safe.email}" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #4a1a6b 100%); color: #fff; padding: 10px 24px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 14px;">Email a ${safe.name}</a>
            <a href="https://wa.me/${String(phone).replace(/[^\d]/g, '')}" style="display: inline-block; background: #25D366; color: #fff; padding: 10px 24px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 14px;">WhatsApp</a>
          </div>
        </div>
        <div style="background: #1e3a5f; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #8aafd4; font-size: 11px; margin: 0;">La Martillera · Remates &amp; Subastas</p>
        </div>
      </div>
      `
    );

    // 2. Confirmación al cliente
    await sendEmail(
      email,
      name,
      `Solicitud de visita recibida — ${auctionTitle}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f8;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #4a1a6b 100%); padding: 40px 32px; text-align: center; border-radius: 8px 8px 0 0;">
          <img src="https://lamartillera.vercel.app/logo.png" alt="La Martillera" style="height: 60px; margin-bottom: 12px;" onerror="this.style.display='none'" />
          <h1 style="color: #f0c040; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 3px;">LA MARTILLERA</h1>
          <p style="color: #c8a8e0; font-size: 13px; margin: 6px 0 0; letter-spacing: 2px;">REMATES &amp; SUBASTAS</p>
        </div>
        <div style="background: #fff; padding: 48px 40px;">
          <h2 style="color: #1e3a5f; font-size: 20px; font-weight: 700; margin: 0 0 16px;">¡Solicitud recibida, ${safe.name}!</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Recibimos tu solicitud de visita para el remate <strong>${safe.auctionTitle}</strong>.
            Nuestro equipo te contactará a la brevedad para confirmarla.
          </p>
          <div style="background: #f8f6ff; border-left: 4px solid #4a1a6b; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
            <p style="color: #1e3a5f; font-size: 13px; font-weight: 700; margin: 0 0 8px;">Detalle de la visita solicitada</p>
            <p style="color: #555; font-size: 14px; margin: 0; line-height: 1.7;">
              ${safe.lotNumber ? `<strong>Lote:</strong> ${safe.lotNumber}<br/>` : ''}
              <strong>Fecha:</strong> ${safe.visitDate}<br/>
              <strong>Hora:</strong> ${safe.visitTime} hrs<br/>
              <strong>Modalidad:</strong> ${safe.visitModality}
            </p>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 20px 0 0;">
            Si tienes alguna duda, escríbenos a
            <a href="mailto:contacto@lamartillera.cl" style="color: #4a1a6b;">contacto@lamartillera.cl</a>
          </p>
        </div>
        <div style="background: #1e3a5f; padding: 24px 32px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #8aafd4; font-size: 12px; margin: 0; line-height: 1.6;">
            © ${year} La Martillera · Remates &amp; Subastas<br/>
            <a href="https://lamartillera.vercel.app" style="color: #c8a8e0; text-decoration: none;">lamartillera.vercel.app</a>
          </p>
        </div>
      </div>
      `
    );

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Error al enviar la solicitud de visita.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
