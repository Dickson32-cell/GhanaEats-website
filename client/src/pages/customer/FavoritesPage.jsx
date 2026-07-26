import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as favApi from '../../api/favoritesApi';
import MenuCard from '../../components/menu/MenuCard';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favApi.getFavorites().then((r) => setFavorites(r.data.data)).finally(() => setLoading(false));
  }, []);

  const favoriteIds = favorites.map((f) => f.menuItemId);

  const handleFavoriteToggle = (itemId, isFav) => {
    if (!isFav) setFavorites((prev) => prev.filter((f) => f.menuItemId !== itemId));
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center py-16" style={{
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF3EB 20%, #FFF8F0 40%, #FFF5F9 60%, #FFF0F5 80%, #FFF5F8 100%)',
    }}>
      <Spinner />
    </div>
  );

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF3EB 20%, #FFF8F0 40%, #FFF5F9 60%, #FFF0F5 80%, #FFF5F8 100%)',
    }}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-bold text-brand-500 mb-2 uppercase tracking-widest">Your collection</p>
        <h1 className="font-display text-4xl font-bold text-dark mb-1">My Favorites</h1>
        <p className="text-dark/40 text-sm">
          {favorites.length > 0 ? `${favorites.length} saved item${favorites.length !== 1 ? 's' : ''}` : 'No favorites yet'}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24 rounded-3xl bg-gray-50/60 border border-gray-100">
          <div className="text-6xl mb-5">🤍</div>
          <h3 className="font-display text-2xl font-bold text-dark/50 mb-2">No favorites yet</h3>
          <p className="text-dark/30 text-sm mb-7 max-w-xs mx-auto">
            Tap the heart on any menu item to save it here for quick access.
          </p>
          <Link to="/menu">
            <Button>Explore Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favorites.map((fav) => (
            <MenuCard
              key={fav.id}
              item={fav.menuItem}
              favoriteIds={favoriteIds}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default FavoritesPage;
