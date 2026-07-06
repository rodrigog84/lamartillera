export type PropertyType =
  | 'Casa'
  | 'Departamento'
  | 'Parcela'
  | 'Terreno'
  | 'Bodega'
  | 'Local Comercial'
  | 'Oficina'
  | 'Edificio'
  | 'Otro';

export type AuctionStatus = 'Disponible' | 'Adjudicada' | 'Próximamente';

export type Currency = 'CLP' | 'UF';

export interface Auction {
  id: string;
  title: string;
  address: string;
  commune: string;
  region: string;
  propertyType: PropertyType;
  status: AuctionStatus;
  minPrice: number;
  currency: Currency;
  guarantee: number;
  auctionDate: string;
  images: string[];
  description: string;
  surface: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  occupation: 'Desocupada' | 'Ocupada' | 'Arrendada';
  featured: boolean;
  externalRegistrationUrl: string;
  createdAt: string;
}
