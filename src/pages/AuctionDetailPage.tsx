import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, DollarSign, Shield, Maximize2,
  Bed, Bath, Car, ArrowLeft, Share2, ChevronLeft,
  ChevronRight, Clock, Home, Building2, CheckCircle,
} from 'lucide-react';
import { getAuctions } from '../data/auctions';
import { formatPrice, formatGuarantee, formatDate, daysUntilAuction } from '../utils/format';
import AuctionCard from '../components/AuctionCard';
import clsx from 'clsx';

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imgIndex, setImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const auctions = getAuctions();
  const auction = auctions.find(a => a.id === id);

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🏚️</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Subasta no encontrada</h1>
          <p className="text-gray-500 mb-6">La subasta que buscas no existe o fue eliminada.</p>
          <Link to="/subastas" className="btn-primary">Ver todas las subastas</Link>
        </div>
      </div>
    );
  }

  const days = daysUntilAuction(auction.auctionDate);
  const similar = auctions
    .filter(a => a.id !== auction.id && a.propertyType === auction.propertyType)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const prevImg = () => setImgIndex(i => (i - 1 + auction.images.length) % auction.images.length);
  const nextImg = () => setImgIndex(i => (i + 1) % auction.images.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-brand-purple-500 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/subastas" className="hover:text-brand-purple-500 transition-colors">Subastas</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium truncate max-w-xs">{auction.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back + share */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Compartir'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: images + details ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-80 sm:h-[480px]">
                {auction.images.length > 0 ? (
                  <>
                    <img
                      src={auction.images[imgIndex]}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                    {auction.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImg}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImg}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {auction.images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setImgIndex(i)}
                              className={clsx(
                                'w-2 h-2 rounded-full transition-all',
                                i === imgIndex ? 'bg-white w-5' : 'bg-white/60'
                              )}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Thumbnails */}
                    {auction.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {auction.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIndex(i)}
                            className={clsx(
                              'w-16 h-12 rounded-lg overflow-hidden border-2 transition-all',
                              i === imgIndex ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'
                            )}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Home className="w-20 h-20 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Title & basic info */}
            <div className="bg-white rounded-2xl p-7 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={clsx(
                      'badge',
                      auction.status === 'Disponible' ? 'bg-green-100 text-green-700' :
                      auction.status === 'Adjudicada' ? 'bg-gray-100 text-gray-600' :
                      'bg-amber-100 text-amber-700'
                    )}>
                      {auction.status}
                    </span>
                    <span className="badge bg-brand-purple-100 text-brand-purple-700">
                      {auction.propertyType}
                    </span>
                    {auction.featured && (
                      <span className="badge bg-brand-blue-100 text-brand-blue-700">Destacado</span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{auction.title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-500 mb-6">
                <MapPin className="w-5 h-5 text-brand-purple-400 flex-shrink-0" />
                <span>{auction.address}, {auction.commune}, {auction.region}</span>
              </div>

              {/* Specs row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Maximize2 className="w-5 h-5 text-brand-purple-400 mx-auto mb-1.5" />
                  <p className="font-bold text-gray-900">{auction.surface.toLocaleString('es-CL')} m²</p>
                  <p className="text-xs text-gray-500">Superficie</p>
                </div>
                {auction.bedrooms !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Bed className="w-5 h-5 text-brand-purple-400 mx-auto mb-1.5" />
                    <p className="font-bold text-gray-900">{auction.bedrooms}</p>
                    <p className="text-xs text-gray-500">Dormitorios</p>
                  </div>
                )}
                {auction.bathrooms !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Bath className="w-5 h-5 text-brand-purple-400 mx-auto mb-1.5" />
                    <p className="font-bold text-gray-900">{auction.bathrooms}</p>
                    <p className="text-xs text-gray-500">Baños</p>
                  </div>
                )}
                {auction.parkingSpaces !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Car className="w-5 h-5 text-brand-purple-400 mx-auto mb-1.5" />
                    <p className="font-bold text-gray-900">{auction.parkingSpaces}</p>
                    <p className="text-xs text-gray-500">Estacionamientos</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="font-bold text-lg text-gray-900 mb-3">Descripción</h2>
                <p className="text-gray-600 leading-relaxed">{auction.description}</p>
              </div>

              {/* Extra info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Tipo de propiedad</p>
                      <p className="font-medium text-gray-800">{auction.propertyType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Ocupación</p>
                      <p className="font-medium text-gray-800">{auction.occupation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: auction info card ── */}
          <div className="space-y-4">
            {/* Price card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              {/* Countdown */}
              {auction.status === 'Disponible' && days >= 0 && (
                <div className="flex items-center gap-2 bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 rounded-xl px-4 py-3 mb-5">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">{days === 0 ? '¡Subasta hoy!' : `${days} día${days !== 1 ? 's' : ''} para la subasta`}</p>
                    <p className="text-xs opacity-70">{formatDate(auction.auctionDate)}</p>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Precio mínimo</p>
                <p className="text-4xl font-black text-gradient">{formatPrice(auction)}</p>
              </div>

              {/* Info grid */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" /> Fecha subasta
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{formatDate(auction.auctionDate)}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Shield className="w-4 h-4" /> Garantía
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{formatGuarantee(auction.guarantee)}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4" /> Región
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{auction.region.split(' - ')[1] ?? auction.region}</span>
                </div>
              </div>

              {/* CTA */}
              {auction.status === 'Disponible' ? (
                <>
                  <a
                    href={auction.externalRegistrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center py-4 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-bold text-lg rounded-2xl hover:opacity-90 transition-opacity shadow-lg mb-3"
                  >
                    Inscríbete en esta subasta
                  </a>
                  <p className="text-center text-xs text-gray-400">
                    La inscripción se realiza en el sitio del martillero autorizado.
                  </p>
                </>
              ) : (
                <div className="w-full block text-center py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl cursor-not-allowed">
                  {auction.status}
                </div>
              )}
            </div>

            {/* Contact blurb */}
            <div className="bg-gradient-to-br from-brand-purple-500 to-brand-blue-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">¿Tienes dudas?</h3>
              <p className="text-sm text-white/80 mb-4">
                Nuestro equipo está disponible para ayudarte en el proceso de subasta.
              </p>
              <Link
                to="/contacto"
                className="block w-full text-center py-3 bg-white text-brand-purple-600 font-semibold rounded-xl text-sm hover:bg-blue-50 transition-colors"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>

        {/* Similar auctions */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subastas similares</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(a => <AuctionCard key={a.id} auction={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
