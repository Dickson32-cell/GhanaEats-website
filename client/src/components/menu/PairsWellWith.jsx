import { useState, useEffect } from 'react';
import { getItems } from '../../api/menuApi';
import { formatPrice } from '../../utils/currency';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const PairsWellWith = ({ currentItem }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!currentItem?.pairsWith) {
      setLoading(false);
      return;
    }

    // Fetch all menu items and filter based on pairsWith text
    getItems()
      .then(res => {
        const allItems = res.data?.data?.items || [];
        const pairsWithTerms = currentItem.pairsWith.toLowerCase().split(',').map(s => s.trim());

        // Find items that match the pairsWith terms
        const matches = allItems.filter(item => {
          if (item.id === currentItem.id) return false;
          const itemName = item.name.toLowerCase();
          return pairsWithTerms.some(term => itemName.includes(term) || term.includes(itemName.split(' ')[0]));
        }).slice(0, 3);

        setSuggestions(matches);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentItem]);

  const handleQuickAdd = async (item) => {
    if (!user) {
      toast.error('Please sign in to add items');
      return;
    }
    try {
      await addToCart(item.id);
      toast.success(`${item.name} added!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (loading || suggestions.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-bold text-dark dark:text-white">Pairs Well With</span>
        <span className="text-2xl">🍽️</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {suggestions.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-600 hover:bg-gray-100 dark:hover:bg-dark-500 transition-all group"
          >
            <img
              src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200'}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-dark dark:text-white text-sm truncate">
                {item.name}
              </h4>
              <p className="text-sm font-bold text-primary">
                {formatPrice(item.price)}
              </p>
            </div>
            <button
              onClick={() => handleQuickAdd(item)}
              className="px-3 py-1.5 bg-dark dark:bg-white text-white dark:text-dark rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PairsWellWith;
