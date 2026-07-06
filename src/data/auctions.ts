import { Auction } from '../types';

export const SAMPLE_AUCTIONS: Auction[] = [
  {
    id: '1',
    title: 'Departamento céntrico con vista panorámica',
    address: 'Av. Providencia 1234, Depto. 801',
    commune: 'Providencia',
    region: 'RM - Metropolitana',
    propertyType: 'Departamento',
    status: 'Disponible',
    minPrice: 3200,
    currency: 'UF',
    guarantee: 4000000,
    auctionDate: '2026-07-15',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    ],
    description: 'Hermoso departamento de 3 dormitorios y 2 baños en el corazón de Providencia. Amplio living-comedor, cocina equipada, terraza con vista a la cordillera. Edificio con portería 24 horas, piscina y gimnasio.',
    surface: 85,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    occupation: 'Desocupada',
    featured: true,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Casa familiar en tranquilo barrio residencial',
    address: 'Los Arrayanes 456',
    commune: 'Las Condes',
    region: 'RM - Metropolitana',
    propertyType: 'Casa',
    status: 'Disponible',
    minPrice: 8500,
    currency: 'UF',
    guarantee: 8000000,
    auctionDate: '2026-07-15',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    ],
    description: 'Amplia casa de dos pisos en barrio residencial exclusivo. 4 dormitorios, 3 baños, patio trasero con jardín. Perfecta para familia que busca tranquilidad con acceso a todos los servicios.',
    surface: 180,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 2,
    occupation: 'Desocupada',
    featured: true,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    createdAt: '2026-06-02T10:00:00Z',
  },
  {
    id: '3',
    title: 'Parcela con vista al lago, ideal turismo',
    address: 'Camino Los Lagos Km 12',
    commune: 'Puerto Varas',
    region: 'X - Los Lagos',
    propertyType: 'Parcela',
    status: 'Disponible',
    minPrice: 1200,
    currency: 'UF',
    guarantee: 2000000,
    auctionDate: '2026-07-29',
    images: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    ],
    description: 'Hermosa parcela de 5.000 m² con vista directa al lago Llanquihue y el volcán Osorno. Ideal para proyecto turístico o residencia de descanso. Acceso pavimentado, agua potable disponible.',
    surface: 5000,
    occupation: 'Desocupada',
    featured: true,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    createdAt: '2026-06-03T10:00:00Z',
  },
  {
    id: '4',
    title: 'Local comercial en pleno centro histórico',
    address: 'Paseo Ahumada 321, Local 5',
    commune: 'Santiago',
    region: 'RM - Metropolitana',
    propertyType: 'Local Comercial',
    status: 'Disponible',
    minPrice: 45000000,
    currency: 'CLP',
    guarantee: 5000000,
    auctionDate: '2026-08-05',
    images: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    ],
    description: 'Local comercial de 120 m² en pleno Paseo Ahumada, sector de alto tráfico peatonal. Incluye bodega y baño. Gran oportunidad de inversión en una de las arterias comerciales más importantes de Santiago.',
    surface: 120,
    occupation: 'Arrendada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    createdAt: '2026-06-04T10:00:00Z',
  },
  {
    id: '5',
    title: 'Oficina ejecutiva en torre corporativa',
    address: 'Av. El Bosque Norte 500, Of. 1201',
    commune: 'Las Condes',
    region: 'RM - Metropolitana',
    propertyType: 'Oficina',
    status: 'Disponible',
    minPrice: 2800,
    currency: 'UF',
    guarantee: 4000000,
    auctionDate: '2026-08-05',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    ],
    description: 'Moderna oficina de 65 m² en emblemática torre del sector financiero. Planta libre, aire acondicionado, acceso a salas de reuniones comunes. Metro cercano.',
    surface: 65,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    createdAt: '2026-06-05T10:00:00Z',
  },
  {
    id: '6',
    title: 'Departamento moderno con amenidades completas',
    address: 'Maipú 890, Depto. 504',
    commune: 'Valparaíso',
    region: 'V - Valparaíso',
    propertyType: 'Departamento',
    status: 'Próximamente',
    minPrice: 1800,
    currency: 'UF',
    guarantee: 3000000,
    auctionDate: '2026-09-10',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    ],
    description: 'Departamento 2D/2B en edificio con excelentes amenidades: piscina, quincho, sala de eventos y conserjería 24 horas. A pasos del centro y del mar.',
    surface: 62,
    bedrooms: 2,
    bathrooms: 2,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    createdAt: '2026-06-06T10:00:00Z',
  },
];

const STORAGE_KEY = 'lamartillera_auctions';

export function getAuctions(): Auction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Auction[];
    }
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_AUCTIONS));
  return SAMPLE_AUCTIONS;
}

export function saveAuctions(auctions: Auction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auctions));
}

export function addAuction(auction: Omit<Auction, 'id' | 'createdAt'>): Auction {
  const auctions = getAuctions();
  const newAuction: Auction = {
    ...auction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  saveAuctions([newAuction, ...auctions]);
  return newAuction;
}

export function updateAuction(id: string, updates: Partial<Auction>): Auction | null {
  const auctions = getAuctions();
  const index = auctions.findIndex(a => a.id === id);
  if (index === -1) return null;
  auctions[index] = { ...auctions[index], ...updates };
  saveAuctions(auctions);
  return auctions[index];
}

export function deleteAuction(id: string): boolean {
  const auctions = getAuctions();
  const filtered = auctions.filter(a => a.id !== id);
  if (filtered.length === auctions.length) return false;
  saveAuctions(filtered);
  return true;
}
