const STORAGE_KEYS = {
  USERS: 'pup_picks_users',
  CURRENT_USER: 'pup_picks_current_user',
  DOG_PROFILES: 'pup_picks_dog_profiles',
  REFERRAL: 'pup_picks_referral',
  REVIEWS: 'pup_picks_reviews'
};

// Simple hash function for passwords (not cryptographically secure, but fine for localStorage demo)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// User management
export function getUsers() {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : {};
}

export function saveUser(username, password) {
  const users = getUsers();
  if (users[username]) {
    throw new Error('Username already exists');
  }
  users[username] = {
    username,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
    referralCode: generateReferralCode(username)
  };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return users[username];
}

export function validateUser(username, password) {
  const users = getUsers();
  const user = users[username];
  if (!user) {
    throw new Error('User not found');
  }
  if (user.passwordHash !== simpleHash(password)) {
    throw new Error('Invalid password');
  }
  return user;
}

export function getCurrentUser() {
  const username = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!username) return null;
  const users = getUsers();
  return users[username] || null;
}

export function setCurrentUser(username) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, username);
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Dog profile management
export function getDogProfiles() {
  const profiles = localStorage.getItem(STORAGE_KEYS.DOG_PROFILES);
  return profiles ? JSON.parse(profiles) : {};
}

export function saveDogProfile(username, profile) {
  const profiles = getDogProfiles();
  profiles[username] = {
    ...profile,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.DOG_PROFILES, JSON.stringify(profiles));
  return profiles[username];
}

export function getDogProfile(username) {
  const profiles = getDogProfiles();
  return profiles[username] || null;
}

// Referral code management
function generateReferralCode(username) {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${username.substring(0, 3).toUpperCase()}${random}`;
}

export function getReferralFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

export function saveReferral(code) {
  localStorage.setItem(STORAGE_KEYS.REFERRAL, code);
}

export function getSavedReferral() {
  return localStorage.getItem(STORAGE_KEYS.REFERRAL);
}

// Image helpers
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function generateShareLink(referralCode) {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?ref=${referralCode}`;
}

// Review management
export function getReviews() {
  const reviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  return reviews ? JSON.parse(reviews) : {};
}

export function getReviewsForToy(toyId) {
  const reviews = getReviews();
  return reviews[toyId] || [];
}

export function addReview(toyId, username, rating, comment) {
  const reviews = getReviews();
  if (!reviews[toyId]) {
    reviews[toyId] = [];
  }

  const review = {
    id: Date.now(),
    username,
    rating,
    comment,
    createdAt: new Date().toISOString()
  };

  reviews[toyId].unshift(review);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return review;
}

export function getUserReviewForToy(toyId, username) {
  const reviews = getReviewsForToy(toyId);
  return reviews.find(r => r.username === username) || null;
}
