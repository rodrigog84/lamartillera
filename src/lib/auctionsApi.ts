import { supabase } from './supabase';
import { Auction, AuctionCategory, AuctionStatus, Currency, PropertyType } from '../types';
import { getMockAuctions, saveMockAuctions } from '../data/mockAuctions';

const MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

// ── Tipo que representa una fila de la base de datos ──
type AuctionRow = {
  id: string;
  title: string;
  address: string;
  commune: string;
  region: string;
  category: AuctionCategory;
  property_type: PropertyType;
  status: AuctionStatus;
  min_price: number;
  currency: Currency;
  guarantee: number;
  auction_date: string;
  images: string[];
  description: string;
  surface: number;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  occupation: 'Desocupada' | 'Ocupada' | 'Arrendada';
  featured: boolean;
  external_registration_url: string;
  doc_bases: string | null;
  doc_cdv: string | null;
  doc_cav: string | null;
  doc_gravamenes: string | null;
  created_at: string;
};

function rowToAuction(row: AuctionRow): Auction {
  return {
    id: row.id,
    title: row.title,
    address: row.address,
    commune: row.commune,
    region: row.region,
    category: row.category,
    propertyType: row.property_type,
    status: row.status,
    minPrice: row.min_price,
    currency: row.currency,
    guarantee: row.guarantee,
    auctionDate: row.auction_date,
    images: row.images ?? [],
    description: row.description,
    surface: row.surface,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    parkingSpaces: row.parking_spaces ?? undefined,
    occupation: row.occupation,
    featured: row.featured,
    externalRegistrationUrl: row.external_registration_url,
    documents: {
      basesDelRemate: row.doc_bases ?? undefined,
      cdv: row.doc_cdv ?? undefined,
      cav: row.doc_cav ?? undefined,
      gravamenes: row.doc_gravamenes ?? undefined,
    },
    createdAt: row.created_at,
  };
}

function auctionToRow(a: Omit<Auction, 'id' | 'createdAt'>) {
  return {
    title: a.title,
    address: a.address,
    commune: a.commune,
    region: a.region,
    category: a.category,
    property_type: a.propertyType,
    status: a.status,
    min_price: a.minPrice,
    currency: a.currency,
    guarantee: a.guarantee,
    auction_date: a.auctionDate,
    images: a.images,
    description: a.description,
    surface: a.surface,
    bedrooms: a.bedrooms ?? null,
    bathrooms: a.bathrooms ?? null,
    parking_spaces: a.parkingSpaces ?? null,
    occupation: a.occupation,
    featured: a.featured,
    external_registration_url: a.externalRegistrationUrl,
    doc_bases: a.documents?.basesDelRemate ?? null,
    doc_cdv: a.documents?.cdv ?? null,
    doc_cav: a.documents?.cav ?? null,
    doc_gravamenes: a.documents?.gravamenes ?? null,
  };
}

// ── CRUD ──

export async function fetchAuctions(): Promise<Auction[]> {
  if (MOCK) return getMockAuctions();

  const { data, error } = await supabase
    .from('auctions')
    .select('*')
    .order('auction_date', { ascending: true });

  if (error) throw new Error(error.message);
  return (data as AuctionRow[]).map(rowToAuction);
}

export async function fetchAuction(id: string): Promise<Auction | null> {
  if (MOCK) return getMockAuctions().find(a => a.id === id) ?? null;

  const { data, error } = await supabase
    .from('auctions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return rowToAuction(data as AuctionRow);
}

export async function createAuction(auction: Omit<Auction, 'id' | 'createdAt'>): Promise<Auction> {
  if (MOCK) {
    const newAuction: Auction = { ...auction, id: Date.now().toString(), createdAt: new Date().toISOString() };
    const all = getMockAuctions();
    saveMockAuctions([newAuction, ...all]);
    return newAuction;
  }

  const { data, error } = await supabase
    .from('auctions')
    .insert(auctionToRow(auction))
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToAuction(data as AuctionRow);
}

export async function updateAuction(id: string, updates: Omit<Auction, 'id' | 'createdAt'>): Promise<Auction> {
  if (MOCK) {
    const all = getMockAuctions();
    const idx = all.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Not found');
    all[idx] = { ...all[idx], ...updates };
    saveMockAuctions(all);
    return all[idx];
  }

  const { data, error } = await supabase
    .from('auctions')
    .update(auctionToRow(updates))
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToAuction(data as AuctionRow);
}

export async function deleteAuction(id: string): Promise<void> {
  if (MOCK) {
    saveMockAuctions(getMockAuctions().filter(a => a.id !== id));
    return;
  }

  const { error } = await supabase
    .from('auctions')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
