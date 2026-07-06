import { Auction } from '../types';

export function formatPrice(auction: Auction): string {
  if (auction.currency === 'UF') {
    return `UF ${auction.minPrice.toLocaleString('es-CL')}`;
  }
  return `$${auction.minPrice.toLocaleString('es-CL')}`;
}

export function formatGuarantee(amount: number): string {
  return `$${amount.toLocaleString('es-CL')}`;
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

export function formatSurface(m2: number): string {
  return `${m2.toLocaleString('es-CL')} m²`;
}

export function daysUntilAuction(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const auctionDate = new Date(dateStr + 'T00:00:00');
  const diff = auctionDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const REGIONS = [
  'I - Tarapacá',
  'II - Antofagasta',
  'III - Atacama',
  'IV - Coquimbo',
  'V - Valparaíso',
  'VI - O\'Higgins',
  'VII - Maule',
  'VIII - Biobío',
  'IX - La Araucanía',
  'X - Los Lagos',
  'XI - Aysén',
  'XII - Magallanes',
  'RM - Metropolitana',
  'XIV - Los Ríos',
  'XV - Arica y Parinacota',
  'XVI - Ñuble',
];

export const PROPERTY_TYPES = [
  'Casa',
  'Departamento',
  'Parcela',
  'Terreno',
  'Bodega',
  'Local Comercial',
  'Oficina',
  'Edificio',
  'Otro',
];

export const OCCUPATION_TYPES = ['Desocupada', 'Ocupada', 'Arrendada'] as const;
