import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import styles from './PurchaseHistory.module.css';

function OrderCard({ order, onViewDetails }) {
  const { addToCart } = useCart();
  const orderDate = new Date(order.purchasedAt).toLocaleDateString();

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart(item);
    });
  };

  return (
    <motion.div
      className={styles.orderCard}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.orderHeader}>
        <span className={styles.orderDate}>{orderDate}</span>
        <span className={styles.orderTotal}>${order.total.toFixed(2)}</span>
      </div>
      <div className={styles.orderItems}>
        {order.items.map((item) => (
          <motion.div
            key={item.id}
            className={styles.orderItem}
            onClick={() => onViewDetails?.(item)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={styles.itemImage}
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemDetails}>
                ${item.price.toFixed(2)} × {item.quantity}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        className={styles.reorderBtn}
        onClick={handleReorder}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Re-order
      </motion.button>
    </motion.div>
  );
}

export function PurchaseHistory({ onViewDetails }) {
  const { purchaseHistory } = useCart();

  if (purchaseHistory.length === 0) {
    return (
      <div className={styles.empty}>
        <ShoppingBag size={32} strokeWidth={1.5} />
        <p>No purchases yet</p>
        <span>Your order history will appear here</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {purchaseHistory.map((order) => (
        <OrderCard key={order.id} order={order} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
