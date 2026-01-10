import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook, Twitter, UserPlus, ShoppingBag, ChevronRight } from 'lucide-react';
import { mockFriends, formatTimeAgo } from '../data/friends';
import styles from './FriendActivity.module.css';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#000000' }
];

export function FriendActivity() {
  const [connectedPlatforms, setConnectedPlatforms] = useState(['instagram']);
  const [showConnectOptions, setShowConnectOptions] = useState(false);

  const handleConnect = (platformId) => {
    if (connectedPlatforms.includes(platformId)) {
      setConnectedPlatforms(prev => prev.filter(p => p !== platformId));
    } else {
      setConnectedPlatforms(prev => [...prev, platformId]);
    }
  };

  // Get all purchases from friends, sorted by time
  const allActivity = mockFriends
    .flatMap(friend =>
      friend.recentPurchases.map(purchase => ({
        ...purchase,
        friend
      }))
    )
    .sort((a, b) => b.purchasedAt - a.purchasedAt);

  return (
    <div className={styles.container}>
      {/* Connect Social Media Section */}
      <div className={styles.connectSection}>
        <div
          className={styles.connectHeader}
          onClick={() => setShowConnectOptions(!showConnectOptions)}
        >
          <div className={styles.connectHeaderLeft}>
            <UserPlus size={18} />
            <span>Connect Social Media</span>
          </div>
          <motion.div
            animate={{ rotate: showConnectOptions ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={18} />
          </motion.div>
        </div>

        <AnimatePresence>
          {showConnectOptions && (
            <motion.div
              className={styles.platformList}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {SOCIAL_PLATFORMS.map(platform => {
                const isConnected = connectedPlatforms.includes(platform.id);
                const Icon = platform.icon;
                return (
                  <motion.button
                    key={platform.id}
                    className={`${styles.platformBtn} ${isConnected ? styles.connected : ''}`}
                    onClick={() => handleConnect(platform.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      '--platform-color': platform.color
                    }}
                  >
                    <Icon size={20} />
                    <span>{platform.name}</span>
                    <span className={styles.connectStatus}>
                      {isConnected ? 'Connected' : 'Connect'}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {connectedPlatforms.length > 0 && !showConnectOptions && (
          <div className={styles.connectedBadges}>
            {connectedPlatforms.map(platformId => {
              const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
              const Icon = platform.icon;
              return (
                <span key={platformId} className={styles.connectedBadge} style={{ background: platform.color }}>
                  <Icon size={12} />
                </span>
              );
            })}
            <span className={styles.connectedCount}>
              {connectedPlatforms.length} connected
            </span>
          </div>
        )}
      </div>

      {/* Friend Activity Feed */}
      <div className={styles.feedSection}>
        <h4 className={styles.feedTitle}>
          <ShoppingBag size={16} />
          Friend Activity
        </h4>

        {allActivity.length === 0 ? (
          <p className={styles.emptyFeed}>
            Connect with friends to see what they're buying for their pups!
          </p>
        ) : (
          <div className={styles.activityList}>
            {allActivity.map((activity, index) => (
              <motion.div
                key={`${activity.friend.id}-${activity.toyId}-${index}`}
                className={styles.activityItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.activityAvatar}>
                  <img
                    src={activity.friend.dog.photo}
                    alt={activity.friend.dog.name}
                    className={styles.dogPhoto}
                  />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>
                    <strong>{activity.friend.name}</strong> bought{' '}
                    <span className={styles.toyName}>{activity.toyName}</span>{' '}
                    for {activity.friend.dog.name}
                  </p>
                  <span className={styles.activityTime}>
                    {formatTimeAgo(activity.purchasedAt)}
                  </span>
                </div>
                <span className={styles.activityPrice}>
                  ${activity.price.toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
