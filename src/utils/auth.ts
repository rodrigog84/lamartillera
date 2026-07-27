const SESSION_KEY = 'lm_admin_session';

// Modo maqueta: cualquier usuario y contraseña no vacíos son aceptados.
// Reemplazar por validación real cuando se integre un backend.
export function login(username: string, password: string): boolean {
  if (username.trim() && password.trim()) {
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
