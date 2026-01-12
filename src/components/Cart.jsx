import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './Cart.module.css';

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, updateQuantity, clearCart, checkout, total, itemCount } = useCart();

  return (
    <>
      <motion.button
        className={styles.cartButton}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingBag size={24} />
        {itemCount > 0 && (
          <motion.span
            className={styles.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            key={itemCount}
          >
            {itemCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                className={styles.panel}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.header}>
                  <h2>Your Cart</h2>
                  <motion.button
                    className={styles.closeButton}
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {items.length === 0 ? (
                  <div className={styles.empty}>
                    <ShoppingBag size={48} strokeWidth={1.5} />
                    <p>Your cart is empty</p>
                    <p className={styles.emptyHint}>Swipe right on toys to add them!</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.items}>
                      <AnimatePresence mode="popLayout">
                        {items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            className={styles.item}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                            transition={{ delay: index * 0.03 }}
                            layout
                          >
                            <div
                              className={styles.itemImage}
                              style={{ backgroundImage: `url(${item.image})` }}
                            />
                            <div className={styles.itemInfo}>
                              <h3>{item.name}</h3>
                              <p>${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className={styles.quantityControls}>
                              <motion.button
                                className={styles.quantityBtn}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                              </motion.button>
                              <span className={styles.quantity}>{item.quantity}</span>
                              <motion.button
                                className={styles.quantityBtn}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Plus size={14} />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className={styles.footer}>
                      <div className={styles.total}>
                        <span>Total ({itemCount} items)</span>
                        <span className={styles.totalAmount}>${total.toFixed(2)}</span>
                      </div>
                      <motion.button
                        className={styles.checkoutButton}
                        onClick={() => {
                          checkout();
                          setIsOpen(false);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Checkout
                      </motion.button>
                      <button className={styles.clearButton} onClick={clearCart}>
                        Clear Cart
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
