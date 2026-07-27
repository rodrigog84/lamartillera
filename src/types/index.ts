export type AuctionCategory = 'Inmuebles' | 'Vehículos' | 'Bienes Muebles';

export type PropertyType =
  // Inmuebles
  | 'Casa'
  | 'Departamento'
  | 'Parcela'
  | 'Terreno'
  | 'Bodega'
  | 'Local Comercial'
  | 'Oficina'
  | 'Edificio'
  // Vehículos
  | 'Auto'
  | 'Camioneta'
  | 'Camión'
  | 'Moto'
  | 'Maquinaria'
  // Bienes Muebles
  | 'Muebles y Equipamiento'
  | 'Lote Mixto'
  | 'Otro';

export type AuctionStatus = 'Disponible' | 'Adjudicada' | 'Próximamente';

export type Currency = 'CLP' | 'UF';

export interface AuctionDocument {
  basesDelRemate?: string;
  cdv?: string;
  cav?: string;
  gravamenes?: string;
}

export interface Auction {
  id: string;
  title: string;
  address: string;
  commune: string;
  region: string;
  category: AuctionCategory;
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
  documents?: AuctionDocument;
  createdAt: string;
}
