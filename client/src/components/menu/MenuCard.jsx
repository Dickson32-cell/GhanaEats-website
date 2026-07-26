import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import * as favApi from '../../api/favoritesApi';
import * as reviewsApi from '../../api/reviewsApi';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';

const MenuCard = ({ item, favoriteIds = [], onFavoriteToggle }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);
  const isFav = favoriteIds.includes(item.id);
  const isAvailable = !item.isAvailable;

  useEffect(() => {
    reviewsApi.getMenuItemAverageRating(item.id)
      .then(res => setRating(res.data.data))
      .catch(() => {});
  }, [item.id]);

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

  // 3D Tilt Effect
  const handleMouseMove = (e) => {
    if (isAvailable || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'none',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'all 0.5s ease',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`group relative bg-white dark:bg-dark-800 rounded-3xl shadow-soft hover:shadow-card transition-shadow duration-300 overflow-hidden flex flex-col stitched-card ${
        isAvailable ? 'opacity-60' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageSrc}
          alt={item.name}
          onError={() => setImgError(true)}
          className={`h-full w-full object-cover transition-transform duration-500 ${isAvailable ? '' : 'group-hover:scale-105'}`}
        />

        {/* Unavailable overlay */}
        {isAvailable && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-4 py-2 text-xs font-semibold rounded-full">
              Sold Out
            </span>
          </div>
        )}

        {/* Category Badge */}
        {item.category && !isAvailable && (
          <div className="absolute top-3 left-3 bg-white/95 dark:bg-dark-700/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-soft-sm">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{item.category.name}</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={toggling}
          className={`absolute top-3 right-3 bg-white/95 dark:bg-dark-700/95 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center shadow-soft-sm transition-all ${
            isAvailable ? 'cursor-not-allowed opacity-50' : 'hover:bg-white dark:hover:bg-dark-600 hover:scale-110'
          }`}
        >
          {toggling ? (
            <svg className="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg
              className={`h-5 w-5 transition-all ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-transparent'}`}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        {/* Sale Badge */}
        {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
          <div className="absolute bottom-3 left-3 bg-accent-pink px-3 py-1 rounded-full shadow-soft-sm">
            <span className="text-xs font-bold text-white">
              {Math.round((1 - parseFloat(item.price) / parseFloat(item.originalPrice)) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-dark dark:text-white mb-1.5 leading-tight">
          {item.name}
        </h3>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        {rating.totalReviews > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(rating.averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 fill-gray-300'
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-600">
              {rating.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({rating.totalReviews})
            </span>
          </div>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Spice Level */}
        {item.spiceLevel !== null && item.spiceLevel !== undefined && item.spiceLevel > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Spice:</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((level) => (
                <span
                  key={level}
                  className={`${
                    level <= item.spiceLevel ? 'text-red-500' : 'text-gray-300'
                  }`}
                >
                  🌶️
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Medium' : 'Hot'}
            </span>
          </div>
        )}

        {/* Protein Options */}
        {item.proteinOptions && (
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Protein Options:</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.proteinOptions}</p>
          </div>
        )}

        {/* Pairs With */}
        {item.pairsWith && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Pairs with:</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.pairsWith}</p>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-bold text-dark dark:text-white">{formatPrice(item.price)}</div>
            {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
              <div className="text-sm text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(item.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || isAvailable}
            className={`px-4 py-2 rounded-full font-semibold transition-all text-xs ${
              isAvailable
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-dark dark:bg-white text-white dark:text-dark hover:bg-gray-800 dark:hover:bg-gray-100 shadow-soft-sm hover:shadow-soft btn-stitched'
            }`}
          >
            {adding ? 'Adding...' : isAvailable ? 'Unavailable' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
