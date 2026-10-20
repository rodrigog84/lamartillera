// Sistema de usuarios regulares — Mock mode usa localStorage, Supabase mode usa Auth real.

import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

const MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

// Clave localStorage para cache de sesión (ambos modos)
const USER_KEY   = 'lm_user';
const USERS_KEY  = 'lm_users_db'; // solo mock

// ── Mock helpers ──
function getMockUsers(): UserProfile[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]'); } catch { return []; }
}
function saveMockUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── API pública ──

/**
 * Devuelve el usuario de la sesión cacheada en localStorage (síncrono).
 * Usar getCurrentUserAsync() cuando se necesite garantía de validez.
 */
export function getCurrentUser(): UserProfile | null {
  try { return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'); } catch { return null; }
}

/**
 * Valida la sesión con Supabase y actualiza el cache.
 * Llámalo en el arranque de la app (App.tsx).
 */
export async function initUserSession(): Promise<UserProfile | null> {
  if (MOCK) return getCurrentUser();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    localStorage.removeItem(USER_KEY);
    return null;
  }

  // Obtener perfil desde la tabla profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile) {
    localStorage.removeItem(USER_KEY);
    return null;
  }

  const user: UserProfile = {
    id: session.user.id,
    name: profile.name,
    email: session.user.email ?? '',
    phone: profile.phone ?? undefined,
    createdAt: profile.created_at,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  phone?: string,
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK) {
    const users = getMockUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'Ya existe una cuenta con este email.' };
    }
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    saveMockUsers([...users, newUser]);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    return { ok: true };
  }

  // Supabase real
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name: name.trim() } },
  });

  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: 'No se pudo crear la cuenta.' };

  // Actualizar perfil con nombre y teléfono
  await supabase.from('profiles').upsert({
    id: data.user.id,
    name: name.trim(),
    phone: phone?.trim() || null,
  });

  const user: UserProfile = {
    id: data.user.id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { ok: true };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK) {
    const users = getMockUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { ok: false, error: 'No existe una cuenta con este email.' };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { ok: true };
  }

  // Supabase real
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) return { ok: false, error: 'Email o contraseña incorrectos.' };
  if (!data.user) return { ok: false, error: 'Error de autenticación.' };

  // Obtener perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  const user: UserProfile = {
    id: data.user.id,
    name: profile?.name ?? data.user.email?.split('@')[0] ?? '',
    email: data.user.email ?? '',
    phone: profile?.phone ?? undefined,
    createdAt: profile?.created_at ?? new Date().toISOString(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { ok: true };
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem(USER_KEY);
  if (!MOCK) {
    await supabase.auth.signOut();
  }
}

export async function updateUserProfile(
  updates: Partial<Pick<UserProfile, 'name' | 'phone'>>,
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK) {
    const current = getCurrentUser();
    if (!current) return { ok: false, error: 'No hay sesión activa.' };
    const updated = { ...current, ...updates };
    const users = getMockUsers().map(u => u.id === current.id ? updated : u);
    saveMockUsers(users);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return { ok: true };
  }

  const current = getCurrentUser();
  if (!current) return { ok: false, error: 'No hay sesión activa.' };

  const { error } = await supabase
    .from('profiles')
    .update({ name: updates.name, phone: updates.phone ?? null })
    .eq('id', current.id);

  if (error) return { ok: false, error: error.message };

  const updated = { ...current, ...updates };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return { ok: true };
}
