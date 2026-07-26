import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import CartItem from './CartItem';
import { formatPrice } from '../../utils/currency';
import ConfettiCelebration from '../ui/ConfettiCelebration';

const CartDrawer = () => {
  const { items, totalPrice, isCartOpen, closeCart } = useCart();
  const navigate = useNavigate();
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [prevItemsCount, setPrevItemsCount] = useState(0);

  useEffect(() => {
    const currentCount = items.reduce((sum, item) => sum + item.quantity, 0);
    if (currentCount > prevItemsCount && prevItemsCount > 0) {
      setConfettiTrigger(prev => prev + 1);
    }
    setPrevItemsCount(currentCount);
  }, [items]);

  const handleCheckout = () => { closeCart(); navigate('/checkout'); };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-display text-xl font-bold text-dark">Your Cart</h2>
            {items.length > 0 && (
              <p className="text-sm text-dark/50 mt-0.5">{items.reduce((s, i) => s + i.quantity, 0)} item(s)</p>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-dark/60"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">🛒</div>
              <div>
                <p className="font-display font-bold text-dark text-lg">Your cart is empty</p>
                <p className="text-sm text-dark/50 mt-1">Add something delicious!</p>
              </div>
              <button
                onClick={() => { closeCart(); navigate('/menu'); }}
                className="mt-2 rounded-2xl bg-brand-500 hover:bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => <CartItem key={item.id} item={item} />)}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-cream/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-dark/60">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-dark/60">
                <span>Delivery fee</span>
                <span>{formatPrice(2.99)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-dark pt-1 border-t border-gray-200">
                <span>Total</span>
                <span className="text-brand-500">{formatPrice(totalPrice + 2.99)}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Checkout
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </div>
        )}
      </div>

      <ConfettiCelebration trigger={confettiTrigger} />
    </>
  );
};

export default CartDrawer;
