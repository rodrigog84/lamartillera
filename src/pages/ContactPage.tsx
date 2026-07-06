import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="hero-gradient pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Contáctanos</h1>
          <p className="text-xl text-blue-100">
            Estamos aquí para ayudarte en todo lo que necesites sobre subastas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-7 shadow-sm">
              <h2 className="font-bold text-xl text-gray-900 mb-6">Información de contacto</h2>
              <div className="space-y-5">
                {[
                  { Icon: Phone, label: 'Teléfono', value: '+56 9 1234 5678', href: 'tel:+56912345678' },
                  { Icon: Mail, label: 'Email', value: 'contacto@lamartillera.cl', href: 'mailto:contacto@lamartillera.cl' },
                  { Icon: MapPin, label: 'Dirección', value: 'Santiago, Chile', href: '#' },
                  { Icon: Clock, label: 'Horario', value: 'Lun–Vie 9:00–18:00', href: '#' },
                ].map(({ Icon, label, value, href }) => (
                  <a key={label} href={href} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-purple-100 transition-colors">
                      <Icon className="w-5 h-5 text-brand-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-gray-800 font-medium group-hover:text-brand-purple-500 transition-colors">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* External CTA */}
            <div className="bg-gradient-to-br from-brand-blue-500 to-brand-purple-600 rounded-2xl p-7 text-white">
              <h3 className="font-bold text-xl mb-3">¿Listo para participar?</h3>
              <p className="text-white/80 text-sm mb-5">
                Regístrate directamente en nuestra plataforma de subastas para participar en los remates.
              </p>
              <a
                href="https://lamartillera.cl/registro"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-white text-brand-purple-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Ir al registro →
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje enviado!</h3>
                <p className="text-gray-500 mb-6">Nos pondremos en contacto contigo a la brevedad.</p>
                <button onClick={() => setSent(false)} className="btn-outline">Enviar otro mensaje</button>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-2xl text-gray-900 mb-6">Envíanos un mensaje</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Nombre completo *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Juan Pérez"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="juan@ejemplo.cl"
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Teléfono</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+56 9 ..."
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Asunto</label>
                      <select
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="input"
                      >
                        <option value="">Seleccionar asunto…</option>
                        <option>Consulta sobre una subasta</option>
                        <option>Proceso de inscripción</option>
                        <option>Publicitar una propiedad</option>
                        <option>Soporte técnico</option>
                        <option>Otro</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Mensaje *</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Cuéntanos en qué podemos ayudarte…"
                      className="input resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
                    <Send className="w-5 h-5" /> Enviar mensaje
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
