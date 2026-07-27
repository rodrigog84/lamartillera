import { Link } from 'react-router-dom';
import {
  Search, UserCheck, FileText, Gavel, CheckCircle,
  ArrowRight, HelpCircle, ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const STEPS = [
  {
    num: '01',
    Icon: Search,
    title: 'Explora las subastas disponibles',
    desc: 'Navega el catálogo y filtra por categoría (Inmuebles, Vehículos, Bienes Muebles), región o precio. Cada ficha incluye descripción, fotografías, precio mínimo y fecha de remate.',
    color: 'from-brand-blue-500 to-brand-blue-600',
    bg: 'bg-brand-blue-50',
    accent: 'text-brand-blue-600',
  },
  {
    num: '02',
    Icon: FileText,
    title: 'Revisa la documentación legal',
    desc: 'Descarga las Bases del Remate, el Certificado de Dominio Vigente (CDV), el Certificado de Anotaciones Vigentes (CAV) y los gravámenes. Toda la información legal está disponible antes de inscribirte.',
    color: 'from-brand-purple-500 to-brand-purple-600',
    bg: 'bg-brand-purple-50',
    accent: 'text-brand-purple-600',
  },
  {
    num: '03',
    Icon: UserCheck,
    title: 'Regístrate en el remate',
    desc: 'Haz clic en "Inscríbete en esta subasta" para ir al sitio oficial del martillero público. Sigue las instrucciones de registro y deposita la garantía exigida dentro del plazo indicado en las bases.',
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    accent: 'text-green-600',
  },
  {
    num: '04',
    Icon: Gavel,
    title: 'Participa en el remate',
    desc: 'El remate se realiza en la fecha y lugar indicados (presencial o en línea, según las bases). Presenta tu postura y compite. El bien se adjudica a quien ofrezca el mayor precio sobre el mínimo.',
    color: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    accent: 'text-amber-600',
  },
  {
    num: '05',
    Icon: CheckCircle,
    title: 'Adjudicación y escrituración',
    desc: 'Si resultaste adjudicado, el martillero público te notificará los pasos para formalizar la transferencia. El saldo de precio debe pagarse dentro del plazo fijado en las bases del remate.',
    color: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50',
    accent: 'text-rose-600',
  },
];

const FAQS = [
  {
    q: '¿Qué es una subasta judicial?',
    a: 'Es un remate ordenado por un tribunal, generalmente para liquidar bienes en el contexto de un juicio ejecutivo o quiebra. El proceso es público y debe ser conducido por un martillero autorizado.',
  },
  {
    q: '¿Para qué sirve la garantía?',
    a: 'La garantía es un depósito previo que acredita tu seriedad como postor. Su monto está fijado en las Bases del Remate. Si no resultás adjudicado, te es devuelta. Si te adjudicás y no pagas el saldo, la pierdes.',
  },
  {
    q: '¿Qué documentos debo revisar antes de postular?',
    a: 'Siempre revisa las Bases del Remate (condiciones del proceso), el CDV (titularidad vigente), el CAV (hipotecas, prohibiciones, embargos) y el informe de gravámenes. Todos disponibles en la ficha de cada bien.',
  },
  {
    q: '¿Puedo visitar el bien antes del remate?',
    a: 'Depende de cada proceso. En algunos casos se habilitan visitas previas coordinadas por el tribunal o el martillero. Revisa las bases del remate específicas o contáctanos para orientarte.',
  },
  {
    q: '¿Los bienes se venden con deudas?',
    a: 'En los remates judiciales, generalmente las hipotecas y deudas bancarias se extinguen con el producto del remate. Sin embargo, algunas deudas por contribuciones o gastos comunes pueden mantenerse. Revisa siempre el CAV y consúltanos.',
  },
  {
    q: '¿Puedo participar si vivo en otra región?',
    a: 'Sí. Muchos remates permiten participación remota o a través de mandatario. Consulta las bases del remate específico o escríbenos por WhatsApp y te orientamos.',
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Gavel className="w-4 h-4" />
            Guía del proceso
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            ¿Cómo funciona un remate?
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Te explicamos paso a paso cómo participar en una subasta pública, qué documentos revisar y qué esperar durante el proceso.
          </p>
        </div>
      </div>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex gap-6 sm:gap-8">
                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-7 sm:left-9 top-16 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
                )}

                {/* Number circle */}
                <div className={`flex-shrink-0 w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className={`flex-1 ${step.bg} rounded-2xl p-6 shadow-sm mb-2`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-black tracking-widest ${step.accent} uppercase`}>Paso {step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-brand-purple-600 font-semibold text-sm uppercase tracking-wider mb-3">
              <HelpCircle className="w-4 h-4" />
              Preguntas frecuentes
            </div>
            <h2 className="text-3xl font-black text-gray-900">Resolvemos tus dudas</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 hero-gradient">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">¿Listo para participar?</h2>
          <p className="text-blue-100 mb-8">Explora las subastas disponibles o escríbenos si tienes dudas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/subastas"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-purple-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-xl"
            >
              Ver subastas disponibles <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`https://wa.me/56995089648?text=${encodeURIComponent('¡Hola! Tengo dudas sobre cómo participar en un remate.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/15 transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
