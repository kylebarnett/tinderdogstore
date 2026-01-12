export const toys = [
  {
    id: 1,
    name: "Squeaky Bone",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=300&fit=crop",
    description: "Classic squeaky bone that dogs love! Durable rubber construction.",
    fullDescription: "This classic squeaky bone is made from durable, non-toxic rubber that can withstand even the most enthusiastic chewers. The built-in squeaker provides hours of entertainment and helps keep your dog engaged. Perfect for fetch, chewing, or just carrying around the house. Easy to clean with soap and water.",
    category: "bones",
    rating: 4.5,
    reviewCount: 128,
    durability: "aggressive", // gentle, moderate, aggressive, destroyer
    playStyles: ["fetch", "cuddle"], // fetch, tug, cuddle, puzzle
    sizes: ["small", "medium", "large"] // compatible dog sizes
  },
  {
    id: 2,
    name: "Rope Tug Toy",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=300&fit=crop",
    description: "Perfect for tug-of-war games. Made with natural cotton fibers.",
    fullDescription: "Our rope tug toy is crafted from 100% natural cotton fibers, making it safe for your dog to chew and play with. The braided design provides multiple textures that help clean teeth and massage gums during play. Great for interactive play sessions and helps strengthen the bond between you and your pup.",
    category: "ropes",
    rating: 4.2,
    reviewCount: 89,
    durability: "aggressive",
    playStyles: ["tug"],
    sizes: ["small", "medium", "large", "giant"]
  },
  {
    id: 3,
    name: "Tennis Ball Pack",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=300&fit=crop",
    description: "Pack of 6 tennis balls. High-bounce and extra durable.",
    fullDescription: "This pack of 6 premium tennis balls is designed specifically for dogs. Unlike regular tennis balls, these feature a reinforced rubber core for extra durability and a felt covering that's gentle on teeth. High-bounce design makes them perfect for fetch, and the bright color makes them easy to spot in grass or at the park.",
    category: "balls",
    rating: 4.8,
    reviewCount: 256,
    durability: "moderate",
    playStyles: ["fetch"],
    sizes: ["small", "medium", "large", "giant"]
  },
  {
    id: 4,
    name: "Plush Duck",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400&h=300&fit=crop",
    description: "Soft plush duck with squeaker. Great for gentle chewers.",
    fullDescription: "This adorable plush duck is perfect for dogs who love soft toys. Features a hidden squeaker inside for added fun, and reinforced stitching to withstand moderate play. The soft, cuddly exterior makes it great for comfort and naptime snuggles. Best suited for gentle to moderate chewers.",
    category: "plush",
    rating: 4.0,
    reviewCount: 67,
    durability: "gentle",
    playStyles: ["cuddle"],
    sizes: ["small", "medium"]
  },
  {
    id: 5,
    name: "Treat Puzzle Ball",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    description: "Interactive puzzle toy that dispenses treats. Keeps dogs entertained!",
    fullDescription: "Keep your dog mentally stimulated with this interactive treat-dispensing puzzle ball. Simply fill with your dog's favorite treats or kibble, and watch them work to get the rewards out. Adjustable difficulty levels make it suitable for beginners and puzzle pros alike. Great for reducing boredom and slowing down fast eaters.",
    category: "puzzle",
    rating: 4.7,
    reviewCount: 184,
    durability: "aggressive",
    playStyles: ["puzzle"],
    sizes: ["small", "medium", "large"]
  },
  {
    id: 6,
    name: "Rubber Frisbee",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
    description: "Soft rubber frisbee, safe for catching. Floats in water!",
    fullDescription: "This flexible rubber frisbee is designed for safe, fun games of fetch. The soft material is gentle on your dog's mouth and gums, making catches comfortable. Floats in water for beach and pool fun, and the bright color ensures high visibility. Folds flat for easy storage in your pocket or bag.",
    category: "balls",
    rating: 4.4,
    reviewCount: 112,
    durability: "moderate",
    playStyles: ["fetch"],
    sizes: ["medium", "large", "giant"]
  },
  {
    id: 7,
    name: "Bacon Chew Toy",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    description: "Bacon-scented chew toy. Irresistible to dogs!",
    fullDescription: "Your dog won't be able to resist this bacon-scented chew toy! Made from durable nylon that's infused with real bacon flavor throughout, so the delicious taste lasts. Helps clean teeth and satisfy your dog's natural urge to chew. Long-lasting and perfect for aggressive chewers.",
    category: "bones",
    rating: 4.6,
    reviewCount: 203,
    durability: "destroyer",
    playStyles: ["cuddle"],
    sizes: ["small", "medium", "large", "giant"]
  },
  {
    id: 8,
    name: "Crinkle Fox",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=300&fit=crop",
    description: "Adorable fox plush with crinkle sound. Multiple textures.",
    fullDescription: "This charming fox plush toy features multiple textures and sounds to keep your dog entertained. The body has a satisfying crinkle sound, while the tail features a squeaker. Different fabric textures provide sensory stimulation. Reinforced seams for durability, but best for gentle to moderate chewers.",
    category: "plush",
    rating: 4.3,
    reviewCount: 91,
    durability: "moderate",
    playStyles: ["cuddle"],
    sizes: ["small", "medium"]
  },
  {
    id: 9,
    name: "Kong Classic",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=300&fit=crop",
    description: "The original Kong! Stuff with treats for hours of fun.",
    fullDescription: "The world-famous Kong Classic is a must-have for every dog owner. Made from ultra-durable natural rubber, it's perfect for stuffing with treats, peanut butter, or wet food. The unpredictable bounce makes it great for fetch, and it can be frozen for an extra-long-lasting challenge. Veterinarian recommended for over 40 years.",
    category: "puzzle",
    rating: 4.9,
    reviewCount: 542,
    durability: "destroyer",
    playStyles: ["puzzle", "fetch"],
    sizes: ["small", "medium", "large", "giant"]
  },
  {
    id: 10,
    name: "Snuffle Mat",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1587764379873-97837921fd44?w=400&h=300&fit=crop",
    description: "Hide treats in the fabric strips. Great mental stimulation.",
    fullDescription: "Turn mealtime into playtime with this enrichment snuffle mat. Hide treats or kibble in the fabric strips and let your dog use their natural foraging instincts to find them. Slows down fast eaters, reduces anxiety, and provides excellent mental stimulation. Machine washable for easy cleaning. Non-slip backing keeps it in place.",
    category: "puzzle",
    rating: 4.5,
    reviewCount: 156,
    durability: "gentle",
    playStyles: ["puzzle"],
    sizes: ["small", "medium", "large", "giant"]
  }
];

// Durability levels ordered from least to most durable
export const durabilityLevels = ['gentle', 'moderate', 'aggressive', 'destroyer'];

export const toyCategories = [
  { id: 'plush', label: 'Plush Toys' },
  { id: 'ropes', label: 'Ropes' },
  { id: 'balls', label: 'Balls' },
  { id: 'bones', label: 'Bones' },
  { id: 'squeaky', label: 'Squeaky Toys' },
  { id: 'puzzle', label: 'Puzzle Toys' }
];
