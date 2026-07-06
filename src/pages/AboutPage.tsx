import { Link } from 'react-router-dom';
import { Gavel, Shield, Star, Users, TrendingUp, MapPin } from 'lucide-react';

export default function AboutPage() {
  const team = [
    { name: 'María González', role: 'Directora General', emoji: '👩‍💼' },
    { name: 'Carlos Riquelme', role: 'Jefe de Operaciones', emoji: '👨‍💼' },
    { name: 'Andrea Soto', role: 'Analista de Propiedades', emoji: '👩‍🔬' },
    { name: 'Diego Fuentes', role: 'Soporte al Cliente', emoji: '🧑‍💻' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="hero-gradient pt-28 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Gavel className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
            Somos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">La Martillera</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            La plataforma digital líder en publicación y difusión de subastas inmobiliarias en Chile. 
            Conectamos propiedades con compradores desde 2020.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-brand-purple-500 uppercase tracking-wider mb-3">Nuestra misión</p>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">
                Democratizamos el acceso a subastas inmobiliarias
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                En La Martillera creemos que todos deben tener acceso a las mejores oportunidades del mercado inmobiliario. 
                Las subastas históricamente han sido procesos opacos y difíciles de acceder. Nosotros cambiamos eso.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Publicamos y difundimos información clara y verificada sobre subastas judiciales y voluntarias 
                de todo Chile, facilitando que compradores e inversores puedan encontrar, evaluar y participar 
                en procesos de remate de manera simple y transparente.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/subastas" className="btn-primary">Ver subastas disponibles</Link>
                <Link to="/contacto" className="btn-outline">Contáctanos</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { Icon: Shield, title: 'Transparencia total', desc: 'Información verificada y completa sobre cada propiedad.', color: 'text-brand-purple-500 bg-brand-purple-50' },
                { Icon: Star, title: 'Calidad de datos', desc: 'Cada subasta es revisada antes de publicarse.', color: 'text-brand-blue-500 bg-brand-blue-50' },
                { Icon: Users, title: 'Comunidad activa', desc: 'Miles de compradores confían en nuestra plataforma.', color: 'text-green-600 bg-green-50' },
                { Icon: TrendingUp, title: 'Mejores precios', desc: 'Propiedades bajo precio de mercado en todo Chile.', color: 'text-amber-600 bg-amber-50' },
              ].map(({ Icon, title, desc, color }) => (
                <div key={title} className="card p-6">
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '2020', label: 'Año de fundación' },
              { value: '200+', label: 'Subastas publicadas' },
              { value: '16', label: 'Regiones cubiertas' },
              { value: '5.000+', label: 'Usuarios registrados' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-5xl font-black text-gradient mb-2">{stat.value}</p>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-brand-purple-500 uppercase tracking-wider mb-2">El equipo</p>
            <h2 className="text-3xl font-bold text-gray-900">Las personas detrás de La Martillera</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="card p-8 text-center hover:-translate-y-1">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MapPin className="w-12 h-12 text-brand-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Cobertura nacional</h2>
          <p className="text-gray-500 text-lg mb-8">
            Publicamos subastas de las 16 regiones de Chile, desde Arica hasta Magallanes.
          </p>
          <Link to="/subastas" className="btn-primary text-base px-10 py-4">
            Explorar subastas →
          </Link>
        </div>
      </section>
    </div>
  );
}
