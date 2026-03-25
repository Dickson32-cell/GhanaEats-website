import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import * as favApi from '../../api/favoritesApi';
import toast from 'react-hot-toast';

const MenuCard = ({ item, favoriteIds = [], onFavoriteToggle }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isFav = favoriteIds.includes(item.id);
  const isAvailable = !item.isAvailable;

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in to add items to cart'); return; }
    if (isAvailable) { toast.error('This item is currently unavailable'); return; }
    setAdding(true);
    try {
      await addToCart(item.id);
      toast.success(
        <span>
          <span className="font-semibold">{item.name}</span> added to cart!
        </span>
      );
    } catch { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please sign in first'); return; }
    setToggling(true);
    try {
      if (isFav) {
        await favApi.removeFavorite(item.id);
        toast.success('Removed from favorites');
      } else {
        await favApi.addFavorite(item.id);
        toast.success('Saved to favorites');
      }
      onFavoriteToggle?.(item.id, !isFav);
    } catch { toast.error('Failed to update favorites'); }
    finally { setToggling(false); }
  };

  const imageSrc = imgError
    ? `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400`
    : (item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400');

  return (
    <div
      className={`group relative rounded-3xl bg-white shadow-card hover:shadow-card-hover border border-gray-100/80 transition-all duration-300 overflow-hidden flex flex-col ${
        isAvailable ? 'opacity-70' : 'hover:-translate-y-1'
      }`}
    >
      {/* Image container */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <img
          src={imageSrc}
          alt={item.name}
          onError={() => setImgError(true)}
          className={`h-full w-full object-cover transition-transform duration-500 ${isAvailable ? '' : 'group-hover:scale-110'}`}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Unavailable overlay */}
        {isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="rounded-full bg-dark/80 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-white">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* Category pill */}
        {item.category && !isAvailable && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-dark shadow-sm">
            {item.category.name}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={toggling}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 ${
            isAvailable ? 'cursor-not-allowed' : 'hover:bg-white hover:scale-110 active:scale-95'
          }`}
        >
          {toggling ? (
            <svg className="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg
              className={`h-4 w-4 transition-all duration-200 ${isFav ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-400 fill-transparent'}`}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        {/* Sale / discount badge */}
        {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
          <span className="absolute bottom-3 left-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            −{Math.round((1 - parseFloat(item.price) / parseFloat(item.originalPrice)) * 100)}%
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-dark text-base leading-tight mb-1 truncate">{item.name}</h3>
        <p className="text-sm text-dark/50 line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem] flex-shrink-0">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-brand-500 leading-none">
              ${parseFloat(item.price).toFixed(2)}
            </span>
            {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
              <span className="text-xs text-dark/30 line-through">
                ${parseFloat(item.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || isAvailable}
            className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-150 active:scale-95 disabled:cursor-not-allowed ${
              isAvailable
                ? 'bg-gray-100 text-gray-400'
                : 'bg-dark hover:bg-dark-700 active:bg-dark-600 text-white shadow-[0_4px_14px_rgba(15,15,20,0.2)] hover:shadow-[0_6px_20px_rgba(15,15,20,0.3)] hover:-translate-y-0.5'
            }`}
          >
            {adding ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Adding...
              </>
            ) : isAvailable ? (
              'Unavailable'
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
