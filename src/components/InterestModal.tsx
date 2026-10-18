import { useState } from 'react';
import { X, Send, CheckCircle, User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';

interface InterestModalProps {
  auctionTitle: string;
  auctionId: string;
  onClose: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function InterestModal({ auctionTitle, auctionId, onClose }: InterestModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hola, tengo interés en el remate "${auctionTitle}". Quisiera recibir más información.`,
  });
  const [state, setState] = useState<FormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');

    // Mock: simula envío con un delay
    // Cuando se conecte Supabase, aquí se insertará en tabla `leads`
    await new Promise(r => setTimeout(r, 1200));

    console.log('Lead registrado:', { ...form, auctionId, auctionTitle });
    setState('success');
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold mb-1">Solicitar información</h2>
          <p className="text-white/80 text-sm line-clamp-2">{auctionTitle}</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {state === 'success' ? (
            // ── Éxito ──
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¡Mensaje enviado!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Nos pondremos en contacto contigo a la brevedad para entregarte más información sobre este remate.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-brand-purple-500 text-white rounded-xl font-semibold hover:bg-brand-purple-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            // ── Formulario ──
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre completo <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Tu nombre"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-300 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    placeholder="tu@email.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-300 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+56 9 1234 5678"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-300 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mensaje <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={set('message')}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-300 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {state === 'error' && (
                <p className="text-red-500 text-sm text-center">
                  Hubo un error al enviar. Por favor intenta nuevamente.
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {state === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="w-4 h-4" /> Enviar solicitud</>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                Nos contactaremos contigo a la brevedad. Sin compromiso.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
