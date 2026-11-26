import { supabase } from './supabase';
import { VisitModality } from '../types';

export type VisitRequestStatus = 'pendiente' | 'contactado' | 'confirmada' | 'cancelada';

export interface VisitRequest {
  id: string;
  auctionId: string | null;
  auctionTitle: string;
  lotNumber?: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  visitDate: string;
  visitTime: string;
  visitModality: VisitModality;
  status: VisitRequestStatus;
  createdAt: string;
}

type VisitRequestRow = {
  id: string;
  auction_id: string | null;
  auction_title: string;
  lot_number: string | null;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  visit_date: string;
  visit_time: string;
  visit_modality: VisitModality;
  status: VisitRequestStatus;
  created_at: string;
};

function rowToVisitRequest(row: VisitRequestRow): VisitRequest {
  return {
    id: row.id,
    auctionId: row.auction_id,
    auctionTitle: row.auction_title,
    lotNumber: row.lot_number ?? undefined,
    userId: row.user_id ?? undefined,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message ?? undefined,
    visitDate: row.visit_date,
    visitTime: row.visit_time,
    visitModality: row.visit_modality,
    status: row.status,
    createdAt: row.created_at,
  };
}

/** Solicitudes del cliente autenticado (por user_id o email) */
export async function fetchMyVisitRequests(): Promise<VisitRequest[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const email = user.email?.toLowerCase() ?? '';
  let query = supabase
    .from('visit_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (email) {
    query = query.or(`user_id.eq.${user.id},email.eq.${email}`);
  } else {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as VisitRequestRow[]).map(rowToVisitRequest);
}

/** Todas las solicitudes (panel admin) */
export async function fetchAllVisitRequests(): Promise<VisitRequest[]> {
  const { data, error } = await supabase
    .from('visit_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as VisitRequestRow[]).map(rowToVisitRequest);
}

export async function updateVisitRequestStatus(
  id: string,
  status: VisitRequestStatus,
): Promise<void> {
  const { error } = await supabase
    .from('visit_requests')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(error.message);
}
