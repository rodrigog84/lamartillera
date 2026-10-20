import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../utils/userAuth';

const MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

function getFavKey(userId: string) {
  return `lm_favs_${userId}`;
}

export function useFavorites() {
  const user = getCurrentUser();
  const [favs, setFavs] = useState<string[]>([]);

  // Carga inicial
  useEffect(() => {
    if (!user) { setFavs([]); return; }

    if (MOCK) {
      const key = getFavKey(user.id);
      try { setFavs(JSON.parse(localStorage.getItem(key) ?? '[]')); } catch { setFavs([]); }
      return;
    }

    // Supabase real
    supabase
      .from('user_favorites')
      .select('auction_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setFavs(data?.map((r: { auction_id: string }) => r.auction_id) ?? []);
      });
  }, [user?.id]);

  const isFav = useCallback((id: string) => favs.includes(id), [favs]);

  const toggle = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false; // no logueado

    if (MOCK) {
      const key = getFavKey(user.id);
      const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
      localStorage.setItem(key, JSON.stringify(next));
      setFavs(next);
      return true;
    }

    // Supabase real
    if (favs.includes(id)) {
      await supabase
        .from('user_favorites')
        .delete()
        .match({ user_id: user.id, auction_id: id });
      setFavs(prev => prev.filter(f => f !== id));
    } else {
      await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, auction_id: id });
      setFavs(prev => [...prev, id]);
    }
    return true;
  }, [user, favs]);

  return { favs, isFav, toggle, isLoggedIn: !!user };
}
