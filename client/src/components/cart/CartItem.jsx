import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 items-center p-3 rounded-2xl hover:bg-cream transition-colors">
      <img
        src={item.menuItem.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100'}
        alt={item.menuItem.name}
        className="h-16 w-16 rounded-2xl object-cover flex-shrink-0 shadow-sm"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-dark truncate">{item.menuItem.name}</p>
        <p className="text-brand-500 text-sm font-bold mt-0.5">${parseFloat(item.menuItem.price).toFixed(2)}</p>
        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => item.quantity > 1 ? updateQuantity(item.menuItemId, item.quantity - 1) : removeItem(item.menuItemId)}
            className="h-7 w-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-sm font-bold text-dark/60 transition-colors"
          >−</button>
          <span className="text-sm font-bold text-dark w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
            className="h-7 w-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-sm font-bold text-dark/60 transition-colors"
          >+</button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-sm font-bold text-dark">${(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}</span>
        <button
          onClick={() => removeItem(item.menuItemId)}
          className="text-gray-300 hover:text-red-400 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
