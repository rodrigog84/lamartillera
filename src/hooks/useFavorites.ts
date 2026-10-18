import { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/userAuth';

function getFavKey(userId: string) {
  return `lm_favs_${userId}`;
}

export function useFavorites() {
  const user = getCurrentUser();
  const key  = user ? getFavKey(user.id) : null;

  const load = (): string[] => {
    if (!key) return [];
    try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; }
  };

  const [favs, setFavs] = useState<string[]>(load);

  // Recarga si cambia el usuario
  useEffect(() => { setFavs(load()); }, [key]);

  const isFav = (id: string) => favs.includes(id);

  const toggle = (id: string): boolean => {
    if (!user || !key) return false; // no logueado
    const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    localStorage.setItem(key, JSON.stringify(next));
    setFavs(next);
    return true;
  };

  return { favs, isFav, toggle, isLoggedIn: !!user };
}
