import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';
import Button from '../ui/Button';
import PairsWellWith from './PairsWellWith';
import toast from 'react-hot-toast';

const QuickViewModal = ({ item, isOpen, onClose, onToggleFavorite, isFavorite }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setImageLoaded(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(item.id);
      }
      toast.success(`${quantity}x ${item.name} added to cart!`);
      onClose();
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const spiceLevelText = ['None', 'Mild', 'Medium', 'Hot'];
  const spiceEmoji = ['', '🌶️', '🌶️🌶️', '🌶️🌶️🌶️'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-dark-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-dark-600 shadow-lg hover:bg-gray-100 dark:hover:bg-dark-500 transition-all hover:rotate-90"
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-h-[90vh] overflow-y-auto">
          {/* Left - Image */}
          <div className="relative bg-gradient-to-br from-peach-50 to-pink-50 dark:from-dark-600 dark:to-dark-700 p-8 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
            <div className="relative w-full h-full flex items-center justify-center">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
              )}
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80'}
                alt={item.name}
                className={`w-full h-full object-contain drop-shadow-2xl transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {item.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/90 dark:bg-dark-600/90 backdrop-blur-sm text-xs font-semibold text-dark dark:text-white rounded-full shadow-lg"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Favorite Button */}
            {user && (
              <button
                onClick={() => onToggleFavorite(item.id, !isFavorite)}
                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-dark-600 shadow-lg hover:scale-110 transition-transform"
              >
                <svg
                  className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* Right - Details */}
          <div className="p-8 flex flex-col">
            {/* Category */}
            <p className="text-sm text-gray-400 dark:text-white/40 uppercase tracking-widest mb-2">
              {item.category?.name}
            </p>

            {/* Title */}
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-3">
              {item.name}
            </h2>

            {/* Price */}
            <div className="text-4xl font-bold text-primary mb-4">
              {formatPrice(item.price)}
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-white/60 mb-6 leading-relaxed">
              {item.description || 'Delicious and freshly prepared.'}
            </p>

            {/* Spice Level */}
            {item.spiceLevel !== null && item.spiceLevel > 0 && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                  Spice Level:
                </span>
                <span className="text-sm">{spiceEmoji[item.spiceLevel]}</span>
                <span className="text-sm text-orange-600 dark:text-orange-300">
                  {spiceLevelText[item.spiceLevel]}
                </span>
              </div>
            )}

            {/* Smart Suggestions */}
            <PairsWellWith currentItem={item} />

            {/* Protein Options */}
            {item.proteinOptions && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                  Protein Options:
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {item.proteinOptions}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-dark dark:text-white">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors"
                >
                  <svg className="w-4 h-4 text-dark dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-bold text-lg text-dark dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors"
                >
                  <svg className="w-4 h-4 text-dark dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              <Button
                onClick={handleAddToCart}
                className="flex-1 py-4 text-lg font-bold"
                disabled={!item.isAvailable}
              >
                {item.isAvailable ? `Add ${quantity} to Cart` : 'Out of Stock'}
              </Button>
            </div>

            {/* Availability Status */}
            {!item.isAvailable && (
              <p className="text-sm text-red-500 dark:text-red-400 text-center mt-3">
                This item is currently unavailable
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuickViewModal;
