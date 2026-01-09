import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { generateShareLink } from '../utils/storage';

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
    <div className="p-5">
      <p className="m-0 mb-4 text-gray-500 text-center">
        Share Pup Picks with your friends and their pups!
      </p>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={shareLink}
          readOnly
          className="flex-1 py-3 px-3 border-2 border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 min-w-0 focus:outline-none focus:border-purple-500"
        />
        <button
          className={`py-3 px-5 border-none rounded-lg font-semibold cursor-pointer transition-all whitespace-nowrap ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="text-center text-gray-500 text-sm mb-4">
        Your referral code: <strong className="text-purple-600 font-mono text-base">{user?.referralCode}</strong>
      </div>

      {navigator.share && (
        <button
          className="w-full py-3.5 border-none rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40"
          onClick={handleShare}
        >
          Share with Friends
        </button>
      )}
    </div>
  );
}
