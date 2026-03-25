import { createContext, useContext, useState, useEffect } from 'react';
import * as cartApi from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (user) {
      cartApi.getCart().then((res) => setItems(res.data.data)).catch(() => {});
    } else {
      setItems([]);
    }
  }, [user]);

  const addToCart = async (menuItemId, quantity = 1) => {
    const res = await cartApi.addItem(menuItemId, quantity);
    await refreshCart();
    return res.data.data;
  };

  const updateQuantity = async (menuItemId, quantity) => {
    await cartApi.updateItem(menuItemId, quantity);
    await refreshCart();
  };

  const removeItem = async (menuItemId) => {
    await cartApi.removeItem(menuItemId);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    setItems([]);
  };

  const refreshCart = async () => {
    const res = await cartApi.getCart();
    setItems(res.data.data);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.menuItem.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, itemCount, totalPrice,
      addToCart, updateQuantity, removeItem, clearCart,
      isCartOpen, toggleCart: () => setIsCartOpen((v) => !v), closeCart: () => setIsCartOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
