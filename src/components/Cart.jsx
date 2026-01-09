import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, clearCart, total, itemCount } = useCart();

  return (
    <>
      <button className="cart-button" onClick={() => setIsOpen(true)}>
        <span className="cart-icon">🛒</span>
        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
      </button>

      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)}>
          <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty</p>
                <p className="cart-empty-hint">Swipe right on toys to add them!</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="cart-item">
                      <div
                        className="cart-item-image"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">${total.toFixed(2)}</span>
                  </div>
                  <button className="checkout-button">Checkout</button>
                  <button className="clear-button" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
