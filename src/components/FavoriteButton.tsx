import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import clsx from 'clsx';

interface Props {
  auctionId: string;
  variant?: 'card' | 'detail'; // card: pequeño, detail: más grande
}

export default function FavoriteButton({ auctionId, variant = 'card' }: Props) {
  const { isFav, toggle, isLoggedIn } = useFavorites();
  const navigate = useNavigate();
  const fav = isFav(auctionId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/ingresar?next=' + encodeURIComponent(window.location.pathname));
      return;
    }
    await toggle(auctionId);
  };

  if (variant === 'detail') {
    return (
      <button
        onClick={handleClick}
        title={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        className={clsx(
          'flex items-center justify-center gap-2 w-full py-3 border-2 font-semibold rounded-xl transition-all text-sm',
          fav
            ? 'border-red-400 bg-red-50 text-red-500 hover:bg-red-100'
            : 'border-brand-purple-400 text-brand-purple-500 hover:bg-brand-purple-50',
        )}
      >
        <Heart className={clsx('w-4 h-4', fav && 'fill-current')} />
        {fav ? 'Guardado en favoritos' : 'Guardar en favoritos'}
      </button>
    );
  }

  // variant === 'card'
  return (
    <button
      onClick={handleClick}
      title={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={clsx(
        'absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all',
        fav
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white',
      )}
    >
      <Heart className={clsx('w-4 h-4', fav && 'fill-current')} />
    </button>
  );
}
