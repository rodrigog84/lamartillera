const SESSION_KEY = 'lm_admin_session';

// Credenciales locales — cámbialo cuando tengas backend real
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'martillera2026';

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}
