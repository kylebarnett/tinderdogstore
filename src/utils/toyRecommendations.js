import { durabilityLevels } from '../data/toys';

/**
 * Calculate a match score for a toy based on dog profile
 * Higher score = better match
 */
export function calculateMatchScore(toy, dogProfile) {
  if (!dogProfile) return 0;

  let score = 0;

  // Size compatibility (high priority)
  if (dogProfile.size && toy.sizes?.includes(dogProfile.size)) {
    score += 30;
  }

  // Play style match (high priority)
  if (dogProfile.playStyle && toy.playStyles?.includes(dogProfile.playStyle)) {
    score += 40;
  }

  // Durability match (medium priority)
  if (dogProfile.chewStrength && toy.durability) {
    const dogDurabilityIndex = durabilityLevels.indexOf(dogProfile.chewStrength);
    const toyDurabilityIndex = durabilityLevels.indexOf(toy.durability);

    // Toy should be at least as durable as dog's chew strength
    if (toyDurabilityIndex >= dogDurabilityIndex) {
      score += 20;
      // Bonus for exact match
      if (toyDurabilityIndex === dogDurabilityIndex) {
        score += 10;
      }
    }
  }

  return score;
}

/**
 * Sort toys by match score (best matches first)
 * Toys that don't match at all go to the end but are still shown
 */
export function sortToysByMatch(toys, dogProfile) {
  if (!dogProfile) return toys;

  return [...toys].sort((a, b) => {
    const scoreA = calculateMatchScore(a, dogProfile);
    const scoreB = calculateMatchScore(b, dogProfile);
    return scoreB - scoreA;
  });
}

/**
 * Get a badge/label for a toy based on dog profile match
 */
export function getMatchBadge(toy, dogProfile) {
  if (!dogProfile) return null;

  const score = calculateMatchScore(toy, dogProfile);

  if (score >= 70) {
    return { label: 'Perfect Match!', type: 'perfect' };
  }
  if (score >= 50) {
    return { label: 'Great for ' + (dogProfile.name || 'your pup'), type: 'great' };
  }
  if (score >= 30) {
    return { label: 'Good fit', type: 'good' };
  }

  // Check for specific warnings
  if (dogProfile.chewStrength) {
    const dogDurabilityIndex = durabilityLevels.indexOf(dogProfile.chewStrength);
    const toyDurabilityIndex = durabilityLevels.indexOf(toy.durability);
    if (toyDurabilityIndex < dogDurabilityIndex) {
      return { label: 'May not last long', type: 'warning' };
    }
  }

  return null;
}
