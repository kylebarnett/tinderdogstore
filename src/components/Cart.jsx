import { useState } from 'react';
import { useCart } from '../context/CartContext';

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, clearCart, total, itemCount } = useCart();

  return (
    <>
      <button
        className="fixed top-5 right-5 w-14 h-14 rounded-full border-none bg-white shadow-lg cursor-pointer flex items-center justify-center transition-all duration-200 z-[100] hover:scale-110 hover:shadow-xl"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-2xl">🛒</span>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-end z-[200] animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md h-full bg-white flex flex-col animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="m-0 text-gray-800 text-xl font-bold">Your Cart</h2>
              <button
                className="w-9 h-9 border-none bg-gray-100 rounded-full text-2xl cursor-pointer flex items-center justify-center text-gray-500 transition-colors hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <p className="my-1">Your cart is empty</p>
                <p className="my-1 text-sm">Swipe right on toys to add them!</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  {items.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3"
                    >
                      <div
                        className="w-16 h-16 rounded-lg bg-cover bg-center bg-gray-200 flex-shrink-0"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="m-0 mb-1 text-sm font-semibold text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <p className="m-0 text-purple-600 font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        className="w-7 h-7 border-none bg-red-100 text-red-600 rounded-full cursor-pointer flex items-center justify-center text-xl flex-shrink-0 transition-colors hover:bg-red-200"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-5 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg">Total:</span>
                    <span className="text-xl font-bold text-purple-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full py-3.5 border-none rounded-xl bg-purple-600 text-white text-base font-semibold cursor-pointer transition-colors mb-2 hover:bg-purple-700">
                    Checkout
                  </button>
                  <button
                    className="w-full py-2.5 border-none bg-transparent text-gray-500 text-sm cursor-pointer transition-colors hover:text-red-600"
                    onClick={clearCart}
                  >
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
