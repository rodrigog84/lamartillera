import { Auction } from '../types';

// PDFs de muestra públicos para demo
const SAMPLE_PDF = 'https://www.africau.edu/images/default/sample.pdf';

export const SAMPLE_AUCTIONS: Auction[] = [

  // ── Inmuebles Disponibles ──
  {
    id: '1',
    title: 'Departamento céntrico con vista panorámica',
    address: 'Av. Providencia 1234, Depto. 801',
    commune: 'Providencia',
    region: 'RM - Metropolitana',
    category: 'Inmuebles',
    propertyType: 'Departamento',
    status: 'Disponible',
    minPrice: 3200,
    currency: 'UF',
    guarantee: 4000000,
    auctionDate: '2026-08-15',
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
    documents: {
      basesDelRemate: SAMPLE_PDF,
      cdv: SAMPLE_PDF,
      cav: SAMPLE_PDF,
      gravamenes: SAMPLE_PDF,
    },
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Casa familiar en tranquilo barrio residencial',
    address: 'Los Arrayanes 456',
    commune: 'Las Condes',
    region: 'RM - Metropolitana',
    category: 'Inmuebles',
    propertyType: 'Casa',
    status: 'Disponible',
    minPrice: 8500,
    currency: 'UF',
    guarantee: 8000000,
    auctionDate: '2026-08-15',
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
    documents: {
      basesDelRemate: SAMPLE_PDF,
      cdv: SAMPLE_PDF,
      cav: SAMPLE_PDF,
    },
    createdAt: '2026-06-02T10:00:00Z',
  },
  {
    id: '3',
    title: 'Parcela con vista al lago, ideal turismo',
    address: 'Camino Los Lagos Km 12',
    commune: 'Puerto Varas',
    region: 'X - Los Lagos',
    category: 'Inmuebles',
    propertyType: 'Parcela',
    status: 'Disponible',
    minPrice: 1200,
    currency: 'UF',
    guarantee: 2000000,
    auctionDate: '2026-08-29',
    images: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    ],
    description: 'Hermosa parcela de 5.000 m² con vista directa al lago Llanquihue y el volcán Osorno. Ideal para proyecto turístico o residencia de descanso. Acceso pavimentado, agua potable disponible.',
    surface: 5000,
    occupation: 'Desocupada',
    featured: true,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
      cdv: SAMPLE_PDF,
    },
    createdAt: '2026-06-03T10:00:00Z',
  },
  {
    id: '4',
    title: 'Local comercial en pleno centro histórico',
    address: 'Paseo Ahumada 321, Local 5',
    commune: 'Santiago',
    region: 'RM - Metropolitana',
    category: 'Inmuebles',
    propertyType: 'Local Comercial',
    status: 'Disponible',
    minPrice: 45000000,
    currency: 'CLP',
    guarantee: 5000000,
    auctionDate: '2026-09-05',
    images: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    ],
    description: 'Local comercial de 120 m² en pleno Paseo Ahumada, sector de alto tráfico peatonal. Incluye bodega y baño. Gran oportunidad de inversión en una de las arterias comerciales más importantes de Santiago.',
    surface: 120,
    occupation: 'Arrendada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
    },
    createdAt: '2026-06-04T10:00:00Z',
  },
  {
    id: '5',
    title: 'Oficina ejecutiva en torre corporativa',
    address: 'Av. El Bosque Norte 500, Of. 1201',
    commune: 'Las Condes',
    region: 'RM - Metropolitana',
    category: 'Inmuebles',
    propertyType: 'Oficina',
    status: 'Disponible',
    minPrice: 2800,
    currency: 'UF',
    guarantee: 4000000,
    auctionDate: '2026-09-05',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    ],
    description: 'Moderna oficina de 65 m² en emblemática torre del sector financiero. Planta libre, aire acondicionado, acceso a salas de reuniones comunes. Metro cercano.',
    surface: 65,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {},
    createdAt: '2026-06-05T10:00:00Z',
  },
  {
    id: '6',
    title: 'Departamento moderno con amenidades completas',
    address: 'Maipú 890, Depto. 504',
    commune: 'Valparaíso',
    region: 'V - Valparaíso',
    category: 'Inmuebles',
    propertyType: 'Departamento',
    status: 'Próximamente',
    minPrice: 1800,
    currency: 'UF',
    guarantee: 3000000,
    auctionDate: '2026-10-10',
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
    documents: {},
    createdAt: '2026-06-06T10:00:00Z',
  },

  // ── Inmuebles Adjudicados ──
  {
    id: 'adj-1',
    title: 'Bodega industrial sector norte — ADJUDICADA',
    address: 'Av. Lo Boza 1200, Bodega C',
    commune: 'Pudahuel',
    region: 'RM - Metropolitana',
    category: 'Inmuebles',
    propertyType: 'Bodega',
    status: 'Adjudicada',
    minPrice: 6200,
    currency: 'UF',
    guarantee: 6000000,
    auctionDate: '2026-06-20',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    ],
    description: 'Bodega industrial de 800 m² con altura libre de 8 m, acceso a camiones, portón eléctrico y oficina. Zona industrial consolidada con fácil acceso a Ruta 68 y Américo Vespucio. Subasta adjudicada exitosamente.',
    surface: 800,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
      cdv: SAMPLE_PDF,
      cav: SAMPLE_PDF,
      gravamenes: SAMPLE_PDF,
    },
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'adj-2',
    title: 'Casa en condominio cerrado sector oriente — ADJUDICADA',
    address: 'Condominio Los Peumos, Casa 14',
    commune: 'La Florida',
    region: 'RM - Metropolitana',
    category: 'Inmuebles',
    propertyType: 'Casa',
    status: 'Adjudicada',
    minPrice: 4800,
    currency: 'UF',
    guarantee: 5000000,
    auctionDate: '2026-05-28',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    ],
    description: 'Casa de 3 dormitorios y 2 baños en condominio cerrado con vigilancia 24h. 110 m² construidos, patio de 80 m², estacionamiento doble. Excelente estado de conservación. Proceso de adjudicación completado.',
    surface: 110,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
      cdv: SAMPLE_PDF,
      cav: SAMPLE_PDF,
    },
    createdAt: '2026-04-20T10:00:00Z',
  },

  // ── Vehículos ──
  {
    id: '7',
    title: 'Camioneta Toyota Hilux 4x4 2020',
    address: 'Depósito judicial, Av. Industrial 900',
    commune: 'Pudahuel',
    region: 'RM - Metropolitana',
    category: 'Vehículos',
    propertyType: 'Camioneta',
    status: 'Disponible',
    minPrice: 12500000,
    currency: 'CLP',
    guarantee: 1500000,
    auctionDate: '2026-08-12',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
    ],
    description: 'Camioneta Toyota Hilux 4x4 doble cabina, año 2020, motor 2.8 diésel, transmisión automática. 95.000 km. Color blanco. En buen estado general, con leves daños de carrocería. Incluye documentación al día.',
    surface: 0,
    occupation: 'Desocupada',
    featured: true,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
    },
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: '8',
    title: 'Automóvil Chevrolet Cruze 2019',
    address: 'Depósito judicial, Av. Industrial 900',
    commune: 'Pudahuel',
    region: 'RM - Metropolitana',
    category: 'Vehículos',
    propertyType: 'Auto',
    status: 'Disponible',
    minPrice: 6800000,
    currency: 'CLP',
    guarantee: 800000,
    auctionDate: '2026-08-12',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80',
    ],
    description: 'Automóvil Chevrolet Cruze LTZ 2019, motor 1.4 turbo nafta, transmisión automática. 68.000 km. Color gris oscuro. Interior en buen estado, mantenciones al día. Se subasta por proceso de liquidación.',
    surface: 0,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
    },
    createdAt: '2026-06-11T10:00:00Z',
  },
  {
    id: '9',
    title: 'Excavadora Caterpillar 320D 2018',
    address: 'Faena minera, Ruta 5 Norte Km 460',
    commune: 'Copiapó',
    region: 'III - Atacama',
    category: 'Vehículos',
    propertyType: 'Maquinaria',
    status: 'Próximamente',
    minPrice: 85000000,
    currency: 'CLP',
    guarantee: 8000000,
    auctionDate: '2026-10-05',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    ],
    description: 'Excavadora Caterpillar 320D, año 2018, 4.200 horas de uso. Motor C7.1 ACERT, brazo estándar de 5,7 m. Operativa, con últimos servicios realizados. Ideal para empresa constructora o minera. Revisión técnica vigente.',
    surface: 0,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {},
    createdAt: '2026-06-12T10:00:00Z',
  },

  // ── Vehículo Adjudicado ──
  {
    id: 'adj-3',
    title: 'Camión Volvo FH 2017 — ADJUDICADO',
    address: 'Depósito judicial, Ruta 5 Sur Km 8',
    commune: 'San Bernardo',
    region: 'RM - Metropolitana',
    category: 'Vehículos',
    propertyType: 'Camión',
    status: 'Adjudicada',
    minPrice: 38000000,
    currency: 'CLP',
    guarantee: 4000000,
    auctionDate: '2026-06-10',
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
    ],
    description: 'Camión Volvo FH 500 año 2017, cabina dormitorio, tracción 6x4, 320.000 km. Motor D13 en buen estado. Documentación y revisión técnica vigente. Subasta finalizada y adjudicada a empresa de transporte.',
    surface: 0,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
    },
    createdAt: '2026-05-15T10:00:00Z',
  },

  // ── Bienes Muebles ──
  {
    id: '10',
    title: 'Lote de equipamiento gastronómico completo',
    address: 'Ex restaurante, Av. Vitacura 3800',
    commune: 'Vitacura',
    region: 'RM - Metropolitana',
    category: 'Bienes Muebles',
    propertyType: 'Lote Mixto',
    status: 'Disponible',
    minPrice: 4200000,
    currency: 'CLP',
    guarantee: 500000,
    auctionDate: '2026-08-20',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80',
    ],
    description: 'Lote completo de equipamiento para restaurante: 2 cocinas industriales a gas, campana extractora, refrigeradores industriales (2), freidoras, batidora industrial, vajilla completa para 80 personas, muebles de salón (12 mesas y 48 sillas). Todo en buen estado de funcionamiento.',
    surface: 0,
    occupation: 'Desocupada',
    featured: true,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
    },
    createdAt: '2026-06-13T10:00:00Z',
  },
  {
    id: '11',
    title: 'Mobiliario y equipos de oficina corporativa',
    address: 'Torre Costanera, Andrés Bello 2477, Of. 1500',
    commune: 'Las Condes',
    region: 'RM - Metropolitana',
    category: 'Bienes Muebles',
    propertyType: 'Muebles y Equipamiento',
    status: 'Disponible',
    minPrice: 2800000,
    currency: 'CLP',
    guarantee: 300000,
    auctionDate: '2026-08-20',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    ],
    description: 'Lote de mobiliario corporativo: 40 escritorios de trabajo, 40 sillas ergonómicas, 6 salas de reuniones completas (mesa + 8 sillas c/u), recepciones, archivadores y cajoneras. Además 25 monitores 24" y 10 impresoras láser. Marca Steelcase y Herman Miller.',
    surface: 0,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
    },
    createdAt: '2026-06-14T10:00:00Z',
  },
  {
    id: '12',
    title: 'Lote de maquinaria textil industrial',
    address: 'Ex planta textil, Ruta 68 Km 22',
    commune: 'Pudahuel',
    region: 'RM - Metropolitana',
    category: 'Bienes Muebles',
    propertyType: 'Lote Mixto',
    status: 'Próximamente',
    minPrice: 18500000,
    currency: 'CLP',
    guarantee: 2000000,
    auctionDate: '2026-10-18',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
    description: 'Lote de maquinaria para industria textil: 15 telares industriales marca Picanol (2015-2018), 8 máquinas de coser industriales Juki, 3 bordadoras computarizadas, sistema de corte automático, mesas de confección y estantes de bodega. Ideal para empresa en rubro confección o exportación.',
    surface: 0,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {},
    createdAt: '2026-06-15T10:00:00Z',
  },

  // ── Bien Mueble Adjudicado ──
  {
    id: 'adj-4',
    title: 'Equipos médicos clínica — ADJUDICADO',
    address: 'Ex Clínica Central, Av. Independencia 1027',
    commune: 'Independencia',
    region: 'RM - Metropolitana',
    category: 'Bienes Muebles',
    propertyType: 'Lote Mixto',
    status: 'Adjudicada',
    minPrice: 9500000,
    currency: 'CLP',
    guarantee: 1000000,
    auctionDate: '2026-05-15',
    images: [
      'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80',
    ],
    description: 'Lote de equipos médicos: 2 ecógrafos Mindray, 1 arco en C fluoroscopía, 10 camas hospitalarias eléctricas, monitores multiparamétricos (8), equipos de esterilización y set completo de instrumental quirúrgico. Proceso adjudicado exitosamente.',
    surface: 0,
    occupation: 'Desocupada',
    featured: false,
    externalRegistrationUrl: 'https://lamartillera.cl/registro',
    documents: {
      basesDelRemate: SAMPLE_PDF,
    },
    createdAt: '2026-04-10T10:00:00Z',
  },
];

const STORAGE_KEY = 'lamartillera_auctions';
const STORAGE_VERSION_KEY = 'lamartillera_version';
const CURRENT_VERSION = '3'; // incrementar al agregar nuevos datos de muestra

export function getAuctions(): Auction[] {
  try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    // Si la versión es distinta, resetear automáticamente con los datos de muestra actuales
    if (storedVersion !== CURRENT_VERSION) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_AUCTIONS));
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return SAMPLE_AUCTIONS;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Auction[];
      return parsed.map(a => ({ ...a, category: a.category ?? ('Inmuebles' as const), documents: a.documents ?? {} }));
    }
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_AUCTIONS));
  localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
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

export function resetToSampleData(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_AUCTIONS));
  localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
}
