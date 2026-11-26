import { useState } from 'react';
import { X, CheckCircle, User, Mail, Phone, MessageSquare, Loader2, Calendar, Clock } from 'lucide-react';
import { AuctionVisit } from '../types';
import { formatDate } from '../utils/format';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../utils/userAuth';
import clsx from 'clsx';

interface Props {
  auctionId: string;
  auctionTitle: string;
  lotNumber?: string;
  visits: AuctionVisit[];
  onClose: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

function visitKey(v: AuctionVisit) {
  return `${v.date}|${v.time}|${v.modality}`;
}

export default function VisitRequestModal({ auctionId, auctionTitle, lotNumber, visits, onClose }: Props) {
  const current = getCurrentUser();
  const [selected, setSelected] = useState(visitKey(visits[0]));
  const [form, setForm] = useState({
    name: current?.name ?? '',
    email: current?.email ?? '',
    phone: current?.phone ?? '',
    message: '',
  });
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const visit = visits.find(v => visitKey(v) === selected);
    if (!visit) {
      setError('Selecciona una fecha de visita.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Ingresa un teléfono / WhatsApp para que podamos contactarte.');
      return;
    }

    setState('loading');
    setError('');

    try {
      const { error: fnError } = await supabase.functions.invoke('request-visit', {
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim() || undefined,
          auctionId,
          auctionTitle,
          lotNumber: lotNumber || undefined,
          visitDate: visit.date,
          visitTime: visit.time,
          visitModality: visit.modality,
        },
      });

      if (fnError) throw fnError;
      setState('success');
    } catch {
      setState('error');
      setError('No pudimos enviar tu solicitud. Intenta nuevamente o escríbenos a contacto@lamartillera.cl');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 p-6 text-white relative flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold mb-1">Solicitar visita</h2>
          <p className="text-white/80 text-sm line-clamp-2">{auctionTitle}</p>
          {lotNumber && <p className="text-white/70 text-xs mt-1">Lote {lotNumber}</p>}
        </div>

        <div className="p-6 overflow-y-auto">
          {state === 'success' ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¡Solicitud enviada!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Te enviamos un correo de confirmación. La Martillera se pondrá en contacto contigo para coordinar la visita.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-brand-purple-500 text-white rounded-xl font-semibold hover:bg-brand-purple-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Elige fecha y modalidad *</p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {visits.map(v => {
                    const key = visitKey(v);
                    return (
                      <label
                        key={key}
                        className={clsx(
                          'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                          selected === key
                            ? 'border-brand-purple-400 bg-brand-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <input
                          type="radio"
                          name="visit"
                          className="mt-1 accent-brand-purple-500"
                          checked={selected === key}
                          onChange={() => setSelected(key)}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-800">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-brand-purple-500" />
                              {formatDate(v.date)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-brand-blue-500" />
                              {v.time} hrs
                            </span>
                          </div>
                          <span className={clsx(
                            'inline-block mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                            v.modality === 'Virtual'
                              ? 'bg-brand-blue-50 text-brand-blue-700'
                              : 'bg-brand-purple-50 text-brand-purple-700'
                          )}>
                            {v.modality}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input required value={form.name} onChange={set('name')} className="input-field pl-9" placeholder="Tu nombre" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" required value={form.email} onChange={set('email')} className="input-field pl-9" placeholder="tu@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono / WhatsApp *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={set('phone')}
                    className="input-field pl-9"
                    placeholder="+56 9 …"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Lo usaremos para contactarte por WhatsApp y confirmar la visita.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensaje (opcional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    rows={3}
                    className="input-field pl-9 resize-none"
                    placeholder="Algún comentario o preferencia adicional…"
                  />
                </div>
              </div>

              {(state === 'error' || error) && (
                <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full py-3 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {state === 'loading'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</>
                  : 'Enviar solicitud'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
