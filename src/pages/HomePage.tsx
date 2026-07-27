import { Link } from 'react-router-dom';
import { Search, TrendingUp, Shield, Users, ArrowRight, CheckCircle, Star, ChevronRight, Building2, Car, Package, Trophy } from 'lucide-react';
import { getAuctions } from '../data/auctions';
import AuctionCard from '../components/AuctionCard';

export default function HomePage() {
  const allAuctions = getAuctions();
  const featured = allAuctions.filter(a => a.featured && a.status !== 'Adjudicada').slice(0, 3);
  const recent = allAuctions.filter(a => a.status === 'Disponible').slice(0, 6);

  const stats = [
    { value: '200+', label: 'Remates publicados' },
    { value: '15+', label: 'Regiones del país' },
    { value: '5.000+', label: 'Compradores registrados' },
    { value: '98%', label: 'Satisfacción' },
  ];

  const categories = [
    {
      icon: Building2,
      label: 'Inmuebles',
      desc: 'Casas, departamentos, parcelas, locales y más',
      to: '/subastas?tipo=Inmuebles',
      color: 'from-brand-blue-500 to-brand-blue-700',
      count: allAuctions.filter(a => (a.category ?? 'Inmuebles') === 'Inmuebles' && a.status === 'Disponible').length,
    },
    {
      icon: Car,
      label: 'Vehículos',
      desc: 'Autos, camionetas, camiones y maquinaria',
      to: '/subastas?tipo=Vehículos',
      color: 'from-brand-purple-500 to-brand-purple-700',
      count: allAuctions.filter(a => a.category === 'Vehículos' && a.status === 'Disponible').length,
    },
    {
      icon: Package,
      label: 'Bienes Muebles',
      desc: 'Equipamiento, maquinaria, lotes y más',
      to: '/subastas?tipo=Bienes Muebles',
      color: 'from-green-500 to-green-700',
      count: allAuctions.filter(a => a.category === 'Bienes Muebles' && a.status === 'Disponible').length,
    },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative hero-gradient min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              Plataforma líder de remates en Chile
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Encuentra tu
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                próxima oportunidad
              </span>
              <br />
              en subasta
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-xl">
              Inmuebles, vehículos y bienes muebles.
              Explora las mejores oportunidades de remates judiciales y voluntarios de todo Chile.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-12">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Link
                  to="/subastas"
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-400 text-lg flex items-center hover:shadow-xl transition-shadow"
                >
                  Buscar por ciudad, región o tipo…
                </Link>
              </div>
              <Link
                to="/subastas"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold text-lg rounded-2xl hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2"
              >
                Buscar <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2">
              {['Inmuebles', 'Vehículos', 'Bienes Muebles', 'Próximas subastas'].map((label, i) => (
                <Link
                  key={label}
                  to={i < 3 ? `/subastas?tipo=${label}` : '/subastas'}
                  className="px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/25 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L1440 80L1440 20C1200 70 960 80 720 60C480 40 240 10 0 30L0 80Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-black text-gradient mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-brand-purple-500 uppercase tracking-wider mb-2">¿Qué estás buscando?</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Explora por categoría</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map(({ icon: Icon, label, desc, to, color, count }) => (
              <Link
                key={label}
                to={to}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${color} p-8 h-full`}>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{label}</h3>
                  <p className="text-white/80 text-sm mb-4">{desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">{count} disponible{count !== 1 ? 's' : ''}</span>
                    <span className="flex items-center gap-1 text-white font-semibold text-sm group-hover:gap-2 transition-all">
                      Ver todos <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured auctions ── */}
      {featured.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold text-brand-purple-500 uppercase tracking-wider mb-2">✦ Selección especial</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Subastas Destacadas</h2>
              </div>
              <Link to="/subastas" className="hidden sm:flex items-center gap-1 text-brand-blue-500 font-semibold hover:gap-2 transition-all">
                Ver todas <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
            <div className="mt-8 sm:hidden text-center">
              <Link to="/subastas" className="btn-outline">Ver todas las subastas</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── How it works teaser ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-purple-500 uppercase tracking-wider mb-3">Paso a paso</p>
              <h2 className="text-3xl font-black text-gray-900 mb-4">¿Primera vez en un remate?</h2>
              <p className="text-gray-600 mb-6 max-w-lg">
                Aprende cómo funciona el proceso, qué documentos revisar, cómo inscribirte y qué esperar el día del remate. Todo explicado de forma simple.
              </p>
              <Link
                to="/como-funciona"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Ver guía completa <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden lg:grid grid-cols-3 gap-3 flex-shrink-0">
              {['Explora', 'Revisa docs', 'Participa'].map((step, i) => (
                <div key={step} className="w-28 h-28 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2">
                  <span className="text-3xl font-black text-gradient">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs font-semibold text-gray-500 text-center">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why us ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-brand-purple-500 uppercase tracking-wider mb-2">¿Por qué elegirnos?</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">La plataforma más completa de remates</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { Icon: Search, title: 'Búsqueda inteligente', desc: 'Filtra por categoría, región, precio y fecha. Encuentra exactamente lo que buscas entre inmuebles, vehículos y bienes muebles.', color: 'bg-brand-blue-50 text-brand-blue-500' },
              { Icon: Shield, title: 'Documentación verificada', desc: 'Bases del remate, CDV, CAV y gravámenes disponibles en cada ficha. Toda la información legal antes de inscribirte.', color: 'bg-brand-purple-50 text-brand-purple-500' },
              { Icon: TrendingUp, title: 'Oportunidades únicas', desc: 'Bienes bajo precio de mercado. Remates judiciales y voluntarios de todo el territorio nacional.', color: 'bg-green-50 text-green-600' },
              { Icon: Users, title: 'Comunidad activa', desc: 'Miles de compradores e inversores registrados. La comunidad más activa de remates de Chile.', color: 'bg-amber-50 text-amber-600' },
              { Icon: CheckCircle, title: 'Proceso simple', desc: 'En pocos pasos te inscribes y participas. Te guiamos desde la búsqueda hasta la adjudicación.', color: 'bg-rose-50 text-rose-500' },
              { Icon: Star, title: 'Soporte especializado', desc: 'Equipo de profesionales disponible para resolver tus dudas sobre el proceso de remate.', color: 'bg-indigo-50 text-indigo-500' },
            ].map(({ Icon, title, desc, color }) => (
              <div key={title} className="card p-7 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent auctions ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-brand-blue-500 uppercase tracking-wider mb-2">✦ Disponibles ahora</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Próximos Remates</h2>
            </div>
            <Link to="/subastas" className="hidden sm:flex items-center gap-1 text-brand-blue-500 font-semibold hover:gap-2 transition-all">
              Ver todos <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map(auction => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/subastas" className="btn-primary text-base px-10 py-4">
              Ver todos los remates disponibles →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Adjudicados teaser ── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Trophy className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Historial de remates adjudicados</h3>
                <p className="text-gray-500 text-sm mt-0.5">Conoce los bienes que ya fueron rematados y los precios alcanzados.</p>
              </div>
            </div>
            <Link
              to="/adjudicados"
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 border-2 border-brand-purple-500 text-brand-purple-600 font-bold rounded-xl hover:bg-brand-purple-500 hover:text-white transition-all"
            >
              Ver historial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight">
            ¿Listo para participar<br />en tu primer remate?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Regístrate, explora los bienes disponibles
            y da el primer paso hacia tu próxima oportunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://lamartillera.cl/registro"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-white text-brand-purple-600 font-bold text-lg rounded-2xl hover:bg-blue-50 transition-colors shadow-xl"
            >
              Crear cuenta gratis
            </a>
            <Link
              to="/como-funciona"
              className="px-10 py-4 border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white/15 transition-colors"
            >
              Cómo funciona →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
