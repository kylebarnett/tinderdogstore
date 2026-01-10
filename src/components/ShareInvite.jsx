import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { generateShareLink } from '../utils/storage';
import styles from './ShareInvite.module.css';

export function ShareInvite() {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  const shareLink = user ? generateShareLink(user.referralCode) : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Pup Picks!',
          text: 'Check out this awesome dog toy store where you can swipe to shop!',
          url: shareLink
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        Share Pup Picks with your friends and their pups!
      </p>

      <div className={styles.linkBox}>
        <input
          type="text"
          value={shareLink}
          readOnly
          className={styles.linkInput}
        />
        <motion.button
          className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={16} />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Copy size={16} />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className={styles.code}>
        Your referral code: <strong>{user?.referralCode}</strong>
      </div>

      {navigator.share && (
        <motion.button
          className={styles.shareBtn}
          onClick={handleShare}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 size={18} />
          Share with Friends
        </motion.button>
      )}
    </div>
  );
}
