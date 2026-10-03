import { supabase } from '../lib/supabase';

const MOCK = import.meta.env.VITE_MOCK_MODE === 'true';
const SESSION_KEY = 'lm_admin_session';

export async function login(email: string, password: string): Promise<boolean> {
  if (MOCK) {
    // En modo mock cualquier usuario y contraseña no vacíos son aceptados
    if (email.trim() && password.trim()) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      return true;
    }
    return false;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
}

export async function logout(): Promise<void> {
  if (MOCK) {
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  await supabase.auth.signOut();
}

export async function getSession() {
  if (MOCK) {
    return sessionStorage.getItem(SESSION_KEY) === 'true' ? { mock: true } : null;
  }
  const { data } = await supabase.auth.getSession();
  return data.session;
}
