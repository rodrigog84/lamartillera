import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY') ?? '';
const ADMIN_EMAIL   = 'contacto@lamartillera.cl';
const SENDER_NAME   = 'La Martillera';
const SENDER_EMAIL  = 'contacto@lamartillera.cl';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subjectLabel = subject || 'Consulta general';

    // 1. Notificación al administrador
    await sendEmail(
      ADMIN_EMAIL,
      'La Martillera',
      `[Contacto] ${subjectLabel} — ${name}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f8;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #4a1a6b 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #f0c040; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: 2px;">LA MARTILLERA</h1>
          <p style="color: #c8a8e0; font-size: 12px; margin: 4px 0 0;">Nuevo mensaje de contacto</p>
        </div>
        <div style="background: #fff; padding: 40px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #444;">
            <tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f; width: 120px;">Nombre</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #4a1a6b;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f;">Teléfono</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; font-weight: 700; color: #1e3a5f;">Asunto</td><td style="padding: 8px 0;">${subjectLabel}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-weight: 700; color: #1e3a5f; margin: 0 0 8px;">Mensaje:</p>
          <p style="color: #555; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          <div style="margin-top: 24px;">
            <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #4a1a6b 100%); color: #fff; padding: 10px 24px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 14px;">Responder a ${name}</a>
          </div>
        </div>
        <div style="background: #1e3a5f; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #8aafd4; font-size: 11px; margin: 0;">La Martillera · Remates &amp; Subastas</p>
        </div>
      </div>
      `
    );

    // 2. Confirmación al usuario
    await sendEmail(
      email,
      name,
      'Recibimos tu mensaje — La Martillera',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f8;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #4a1a6b 100%); padding: 40px 32px; text-align: center; border-radius: 8px 8px 0 0;">
          <img src="https://lamartillera.vercel.app/logo.png" alt="La Martillera" style="height: 60px; margin-bottom: 12px;" onerror="this.style.display='none'" />
          <h1 style="color: #f0c040; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 3px;">LA MARTILLERA</h1>
          <p style="color: #c8a8e0; font-size: 13px; margin: 6px 0 0; letter-spacing: 2px;">REMATES &amp; SUBASTAS</p>
        </div>
        <div style="background: #fff; padding: 48px 40px;">
          <h2 style="color: #1e3a5f; font-size: 20px; font-weight: 700; margin: 0 0 16px;">¡Recibimos tu mensaje, ${name}!</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Gracias por contactarnos. Hemos recibido tu consulta sobre <strong>${subjectLabel}</strong>
            y nos pondremos en contacto contigo a la brevedad.
          </p>
          <div style="background: #f8f6ff; border-left: 4px solid #4a1a6b; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
            <p style="color: #666; font-size: 13px; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 20px 0 0;">
            Si tienes alguna duda urgente, puedes escribirnos directamente a
            <a href="mailto:${ADMIN_EMAIL}" style="color: #4a1a6b;">${ADMIN_EMAIL}</a>
          </p>
        </div>
        <div style="background: #1e3a5f; padding: 24px 32px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #8aafd4; font-size: 12px; margin: 0; line-height: 1.6;">
            © 2024 La Martillera · Remates &amp; Subastas<br/>
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
    return new Response(JSON.stringify({ error: 'Error al enviar el mensaje.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
