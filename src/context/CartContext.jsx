import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (toy) => {
    setItems((prev) => [...prev, toy]);
  };

  const removeFromCart = (toyId) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === toyId);
      if (index === -1) return prev;
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
