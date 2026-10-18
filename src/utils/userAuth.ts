// Sistema de usuarios regulares (distinto al admin)
// Mock mode: usa localStorage. Supabase mode: usará auth + tabla profiles.

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

const MOCK = import.meta.env.VITE_MOCK_MODE === 'true';
const USER_KEY   = 'lm_user';
const USERS_KEY  = 'lm_users_db'; // "base de datos" local de usuarios registrados

// ── Mock helpers ──
function getMockUsers(): UserProfile[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]'); } catch { return []; }
}
function saveMockUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── API ──

export function getCurrentUser(): UserProfile | null {
  if (MOCK) {
    try { return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'); } catch { return null; }
  }
  // TODO: Supabase — obtener perfil desde tabla profiles
  return null;
}

export async function registerUser(name: string, email: string, _password: string, phone?: string): Promise<{ ok: boolean; error?: string }> {
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
  // TODO: Supabase — supabase.auth.signUp + insert en profiles
  return { ok: false, error: 'No implementado' };
}

export async function loginUser(email: string, _password: string): Promise<{ ok: boolean; error?: string }> {
  if (MOCK) {
    const users = getMockUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { ok: false, error: 'No existe una cuenta con este email.' };
    // En mock no validamos contraseña (modo desarrollo)
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { ok: true };
  }
  // TODO: Supabase — supabase.auth.signInWithPassword
  return { ok: false, error: 'No implementado' };
}

export function logoutUser(): void {
  localStorage.removeItem(USER_KEY);
}

export async function updateUserProfile(updates: Partial<Pick<UserProfile, 'name' | 'phone'>>): Promise<{ ok: boolean; error?: string }> {
  if (MOCK) {
    const current = getCurrentUser();
    if (!current) return { ok: false, error: 'No hay sesión activa.' };
    const updated = { ...current, ...updates };
    // Actualizar en "DB" y sesión
    const users = getMockUsers().map(u => u.id === current.id ? updated : u);
    saveMockUsers(users);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return { ok: true };
  }
  return { ok: false, error: 'No implementado' };
}
