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
      toast.success(`${item.name} added to cart!`);
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

  // Random rotation for quirky effect
  const rotations = ['-rotate-[0.5deg]', 'rotate-[0.5deg]', '-rotate-[1deg]', 'rotate-[1deg]'];
  const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

  return (
    <div
      className={`group relative bg-white border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ${randomRotation} ${
        isAvailable ? 'opacity-60' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden border-b-4 border-black">
        <img
          src={imageSrc}
          alt={item.name}
          onError={() => setImgError(true)}
          className={`h-full w-full object-cover transition-transform duration-300 ${isAvailable ? '' : 'group-hover:scale-105'}`}
        />

        {/* Unavailable overlay */}
        {isAvailable && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase border-2 border-black rotate-[-3deg]">
              Sold Out
            </span>
          </div>
        )}

        {/* Category Badge - Top Left */}
        {item.category && !isAvailable && (
          <div className="absolute top-3 left-3 bg-accent-yellow border-2 border-black px-3 py-1 shadow-brutal-sm">
            <span className="text-xs font-black uppercase">{item.category.name}</span>
          </div>
        )}

        {/* Favorite Button - Top Right */}
        <button
          onClick={handleFavorite}
          disabled={toggling}
          className={`absolute top-3 right-3 bg-white border-2 border-black w-10 h-10 flex items-center justify-center shadow-brutal-sm hover:bg-accent-pink hover:rotate-12 transition-all ${
            isAvailable ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {toggling ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg
              className={`h-5 w-5 transition-all ${isFav ? 'text-red-500 fill-red-500' : 'text-black fill-transparent'}`}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        {/* Sale Badge - Bottom Left */}
        {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
          <div className="absolute bottom-3 left-3 bg-accent-pink border-2 border-black px-3 py-1 shadow-brutal-sm rotate-[-3deg]">
            <span className="text-xs font-black text-white">
              -{Math.round((1 - parseFloat(item.price) / parseFloat(item.originalPrice)) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-xl font-black text-black uppercase mb-2 leading-tight">
          {item.name}
        </h3>
        <p className="text-sm text-gray-600 font-medium mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-3xl font-black text-brand-500 leading-none">
              ${parseFloat(item.price).toFixed(2)}
            </div>
            {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
              <div className="text-sm text-gray-400 line-through font-bold">
                ${parseFloat(item.originalPrice).toFixed(2)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || isAvailable}
            className={`px-5 py-3 text-sm font-black uppercase border-3 border-black transition-all ${
              isAvailable
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brand-500 text-white hover:bg-accent-yellow hover:text-black shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5'
            }`}
          >
            {adding ? '...' : isAvailable ? 'N/A' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
