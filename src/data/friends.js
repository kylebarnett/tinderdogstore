// Mock friends data with their dogs and recent purchases
export const mockFriends = [
  {
    id: 'friend-1',
    name: 'Sarah M.',
    username: 'sarahm',
    avatar: null,
    dog: {
      name: 'Max',
      photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop',
      breed: 'Golden Retriever'
    },
    recentPurchases: [
      { toyId: 1, toyName: 'Squeaky Bone Deluxe', price: 12.99, purchasedAt: Date.now() - 1000 * 60 * 30 },
      { toyId: 3, toyName: 'Tug-of-War Rope', price: 9.99, purchasedAt: Date.now() - 1000 * 60 * 60 * 24 * 2 }
    ],
    connectedVia: 'instagram'
  },
  {
    id: 'friend-2',
    name: 'Mike T.',
    username: 'miket',
    avatar: null,
    dog: {
      name: 'Bella',
      photo: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=100&h=100&fit=crop',
      breed: 'Labrador'
    },
    recentPurchases: [
      { toyId: 5, toyName: 'Puzzle Treat Ball', price: 18.99, purchasedAt: Date.now() - 1000 * 60 * 60 * 2 }
    ],
    connectedVia: 'facebook'
  },
  {
    id: 'friend-3',
    name: 'Emma K.',
    username: 'emmak',
    avatar: null,
    dog: {
      name: 'Charlie',
      photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop',
      breed: 'French Bulldog'
    },
    recentPurchases: [
      { toyId: 2, toyName: 'Plush Duck Friend', price: 14.99, purchasedAt: Date.now() - 1000 * 60 * 60 * 5 },
      { toyId: 4, toyName: 'Tennis Ball Pack', price: 8.99, purchasedAt: Date.now() - 1000 * 60 * 60 * 5 }
    ],
    connectedVia: 'twitter'
  },
  {
    id: 'friend-4',
    name: 'James L.',
    username: 'jamesl',
    avatar: null,
    dog: {
      name: 'Luna',
      photo: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=100&h=100&fit=crop',
      breed: 'Husky'
    },
    recentPurchases: [
      { toyId: 6, toyName: 'Chew Ring Durable', price: 11.99, purchasedAt: Date.now() - 1000 * 60 * 60 * 24 }
    ],
    connectedVia: 'instagram'
  }
];

// Helper to format relative time
export function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
