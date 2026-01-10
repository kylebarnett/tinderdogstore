import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (toy) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === toy.id);
      if (existingIndex !== -1) {
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1
        };
        return newItems;
      }
      return [...prev, { ...toy, quantity: 1 }];
    });
  };

  const removeFromCart = (toyId) => {
    setItems((prev) => prev.filter((item) => item.id !== toyId));
  };

  const updateQuantity = (toyId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(toyId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === toyId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
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
