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

export type AuctionOrigin = 'Privado' | 'Judicial' | 'Concursal';

export type Currency = 'CLP' | 'UF';

export type VisitModality = 'Virtual' | 'Presencial';

export interface AuctionVisit {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  modality: VisitModality;
}

export interface AuctionDocument {
  basesGenerales?: string;
  basesEspecificas?: string;
  cdv?: string;
  cav?: string;
  gravamenes?: string;
}

export interface Auction {
  id: string;
  title: string;
  /** Número de lote del remate (ej. "001", "A-12") */
  lotNumber: string;
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
  origin: AuctionOrigin;
  featured: boolean;
  externalRegistrationUrl: string;
  /** Fechas/horas de visita (pueden ser varias) */
  visits: AuctionVisit[];
  documents?: AuctionDocument;
  createdAt: string;
}
