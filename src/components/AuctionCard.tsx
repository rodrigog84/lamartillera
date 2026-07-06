import { Link } from 'react-router-dom';
import { Calendar, MapPin, Maximize2, Bed, Bath, Car, Clock } from 'lucide-react';
import clsx from 'clsx';
import { Auction } from '../types';
import { formatPrice, formatGuarantee, formatDate, daysUntilAuction } from '../utils/format';

interface Props {
  auction: Auction;
}

const STATUS_STYLES: Record<Auction['status'], string> = {
  Disponible: 'bg-green-100 text-green-700',
  Adjudicada: 'bg-gray-100 text-gray-600',
  Próximamente: 'bg-amber-100 text-amber-700',
};

export default function AuctionCard({ auction }: Props) {
  const days = daysUntilAuction(auction.auctionDate);
  const imgSrc = auction.images[0] ?? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=70';

  return (
    <div className="card group flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imgSrc}
          alt={auction.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Status badge */}
        <span className={clsx('badge absolute top-3 left-3', STATUS_STYLES[auction.status])}>
          {auction.status}
        </span>

        {/* Property type */}
        <span className="badge absolute top-3 right-3 bg-white/90 text-gray-700">
          {auction.propertyType}
        </span>

        {/* Countdown */}
        {auction.status === 'Disponible' && days >= 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-brand-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            <Clock className="w-3 h-3" />
            {days === 0 ? '¡Hoy!' : `${days} día${days !== 1 ? 's' : ''}`}
          </div>
        )}

        {/* Featured ribbon */}
        {auction.featured && (
          <div className="absolute top-0 right-0 bg-brand-blue-500 text-white text-[10px] font-bold px-3 py-1 rotate-0 rounded-bl-xl">
            DESTACADO
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2 group-hover:text-brand-purple-600 transition-colors">
          {auction.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{auction.commune}, {auction.region.split(' - ')[1] ?? auction.region}</span>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" /> {auction.surface.toLocaleString('es-CL')} m²
          </span>
          {auction.bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" /> {auction.bedrooms} dorm.
            </span>
          )}
          {auction.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" /> {auction.bathrooms} baños
            </span>
          )}
          {auction.parkingSpaces !== undefined && (
            <span className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5" /> {auction.parkingSpaces} est.
            </span>
          )}
        </div>

        {/* Price & date */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide">Precio mínimo</p>
            <p className="text-xl font-bold text-gradient leading-tight">
              {formatPrice(auction)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400 uppercase font-medium tracking-wide">Subasta</p>
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-1 justify-end">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(auction.auctionDate)}
            </p>
          </div>
        </div>

        {/* Guarantee */}
        <p className="mt-2 text-xs text-gray-400">
          Garantía: {formatGuarantee(auction.guarantee)}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link
            to={`/subastas/${auction.id}`}
            className="flex-1 text-center py-2.5 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Ver detalles
          </Link>
          {auction.status === 'Disponible' && (
            <a
              href={auction.externalRegistrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 border-2 border-brand-purple-500 text-brand-purple-500 hover:bg-brand-purple-500 hover:text-white rounded-xl text-sm font-semibold transition-all"
            >
              Inscríbete
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
