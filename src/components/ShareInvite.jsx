import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { generateShareLink } from '../utils/storage';
import './ShareInvite.css';

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
      // Fallback for older browsers
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
    <div className="share-invite">
      <p className="share-description">
        Share Pup Picks with your friends and their pups!
      </p>

      <div className="share-link-box">
        <input
          type="text"
          value={shareLink}
          readOnly
          className="share-link-input"
        />
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="share-code">
        Your referral code: <strong>{user?.referralCode}</strong>
      </div>

      {navigator.share && (
        <button className="share-btn" onClick={handleShare}>
          Share with Friends
        </button>
      )}
    </div>
  );
}
