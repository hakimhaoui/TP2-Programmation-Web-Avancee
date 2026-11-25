import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { useAuth } from './AuthContext';
import { createCartStore } from '../utils/cartStore.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isClient } = useAuth();
  const userId = user?.id ?? null;
  const canUseCart = !user || isClient;
  const store = useMemo(() => createCartStore(userId, canUseCart), [userId, canUseCart]);
  const { items, message } = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const value = useMemo(() => ({
    items, message, canUseCart,
    setMessage: store.setMessage,
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    getCartTotal: () => items.reduce((sum, i) => sum + i.prix * i.quantite, 0),
    getCartCount: () => items.reduce((sum, i) => sum + i.quantite, 0),
  }), [items, message, canUseCart, store]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans CartProvider');
  return ctx;
}
