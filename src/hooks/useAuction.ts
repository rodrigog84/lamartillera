import { useState, useEffect } from 'react';
import { Auction } from '../types';
import { fetchAuction } from '../lib/auctionsApi';

export function useAuction(id: string | undefined) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    fetchAuction(id)
      .then(data => { setAuction(data); setLoading(false); })
      .catch(e => { setError((e as Error).message); setLoading(false); });
  }, [id]);

  return { auction, loading, error };
}
