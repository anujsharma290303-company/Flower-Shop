/**
 * Application-wide constants
 * Used throughout the frontend for consistency
 */

import { SOCIAL_FLOWERS_HOMEPAGE } from './socialflowersHomepage'

// ============================================
// API CONFIGURATION
// ============================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  BEST_SELLERS: '/products?isBestSeller=true',
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: number) => `/categories/${id}`,
  CATEGORY_BY_SLUG: (slug: string) => `/categories/${slug}`,
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id: number) => `/orders/${id}`,
  
  // Reviews
  REVIEWS: '/reviews',
  PRODUCT_REVIEWS: (productId: number) => `/products/${productId}/reviews`,
  
  // Site Config
  SITE_CONFIG: '/site-config',
  
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
}

// ============================================
// PAGINATION DEFAULTS
// ============================================

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 12
export const MAX_LIMIT = 100

// ============================================
// COLORS
// ============================================

export const COLORS = {
  primary: {
    red: '#D63447',
    pink: '#E85D75',
    green: '#4CB584',
  },
  text: {
    dark: '#1a1a1a',
    gray: '#666666',
    light: '#999999',
  },
  bg: {
    white: '#ffffff',
    light: '#f5f5f5',
    lighter: '#f9f9f9',
  },
  border: '#e0e0e0',
  footer: '#1a1a1a',
} as const

// ============================================
// UI CONFIGURATION
// ============================================

export const UI_CONFIG = {
  // Button sizes (in Tailwind classes)
  button: {
    xs: 'px-3 py-1 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  },
  
  // Input sizes
  input: {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-base',
    lg: 'h-12 px-4 text-lg',
  },
  
  // Container max width
  containerMaxWidth: '1280px',
  
  // Default border radius
  borderRadius: '8px',
  
  // Transition duration
  transitionDuration: '200ms',
}

// ============================================
// NAVIGATION
// ============================================

export const SHOP_CATEGORIES = SOCIAL_FLOWERS_HOMEPAGE.footer.shop

export const COMPANY_LINKS = [...SOCIAL_FLOWERS_HOMEPAGE.footer.company, { label: 'Terms of Service', href: '/terms' }]

export const USES_LINKS = SOCIAL_FLOWERS_HOMEPAGE.footer.uses.map((link) => ({
  label: link.label,
  href: link.href.replace(/\/$/, ''),
}))

export const SOCIAL_LINKS = SOCIAL_FLOWERS_HOMEPAGE.footer.socialLinks.map((social) => ({
  platform: social.platform,
  href: social.href,
  icon: social.platform,
}))

// ============================================
// HERO SECTION
// ============================================

export const HERO_SECTION = {
  headline: SOCIAL_FLOWERS_HOMEPAGE.headings.hero,
  subheadline: 'A connection to remember: Fresh flower delivery using email, mobile or social media.',
  ctaPrimary: 'Shop Now',
  ctaSecondary: 'Learn More',
  imageUrl: SOCIAL_FLOWERS_HOMEPAGE.heroImage,
  imageAlt: SOCIAL_FLOWERS_HOMEPAGE.heroImageAlt,
}

// ============================================
// HOW IT WORKS SECTION
// ============================================

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Choose a bouquet',
    description: 'Choose a fresh bouquet at SocialFlowers.com',
  },
  {
    step: 2,
    title: 'Provide contact info',
    description: 'Provide the recipient\'s email, mobile, or social media',
  },
  {
    step: 3,
    title: 'Recipient chooses details',
    description: 'Recipient uses link to choose where and when to receive',
  },
  {
    step: 4,
    title: 'Send confirmation',
    description: 'We email/text them a "You\'ve Got Flowers!" link',
  },
  {
    step: 5,
    title: 'Charge on acceptance',
    description: 'You are only charged when recipient accepts flowers',
  },
  {
    step: 6,
    title: 'Local delivery',
    description: 'Local florist delivers your flowers',
  },
  {
    step: 7,
    title: 'Earn credits',
    description: 'Recipient shares photo/video and you earn credits',
  },
]

// ============================================
// BENEFITS SECTION
// ============================================

export const BENEFITS = {
  everyone: {
    title: 'For Everyone',
    icon: 'GiftIcon',
    points: [
      'Make a meaningful connection through flowers',
      'Your privacy is our priority',
      'We deliver beautiful flowers using the best florists',
      'Earn credits when pictures and videos are shared',
    ],
  },
  senders: {
    title: 'For the Sender',
    icon: 'SendIcon',
    points: [
      'Send flowers with any type of contact information',
      'The recipient helps by providing the delivery address and date',
      'Only pay if they accept',
      'See pictures and videos of the recipient with your flowers',
    ],
  },
  recipients: {
    title: 'For the Recipient',
    icon: 'ReceiveIcon',
    points: [
      'Receive and request flowers from anyone safely',
      'Choose when and where to receive flowers',
      'Deepen your connections and beautify your home',
      'Thank the sender by sharing photos and videos',
    ],
  },
}

// ============================================
// CUSTOM BOUQUET SECTION
// ============================================

export const CUSTOM_BOUQUET_CARDS = [
  {
    id: 'recipients-choice',
    title: "Recipient's Choice: Custom Bouquet",
    subtitle: 'Your recipient creates the bouquet!',
    description: 'You set the price, your special someone chooses colors, flower types and more',
    ctaLabel: 'Buy Now',
    ctaHref: '/let-recipient-choose-flowers',
    imageSrc: SOCIAL_FLOWERS_HOMEPAGE.customBouquets.recipientsChoiceImage,
  },
  {
    id: 'senders-choice',
    title: "Sender's Choice: Custom Bouquet",
    subtitle: 'You create the bouquet!',
    description: 'Set your price and choose colors, flower types, and more',
    ctaLabel: 'Buy Now',
    ctaHref: '/create-a-bouquet',
    imageSrc: SOCIAL_FLOWERS_HOMEPAGE.customBouquets.sendersChoiceImage,
  },
]

export const FLOWERME_SECTION = {
  title: SOCIAL_FLOWERS_HOMEPAGE.headings.flowerMe,
  description: 'A new way to be celebrated, receive flowers, and feel adored. Watch the video below and learn more.',
  ctaLabel: 'Learn More',
  ctaHref: 'https://flowerme.socialflowers.com/',
  videoSrc: SOCIAL_FLOWERS_HOMEPAGE.flowerMe.videoUrl,
  thumbnailUrl: SOCIAL_FLOWERS_HOMEPAGE.flowerMe.thumbnailUrl,
}

// ============================================
// COMMON MESSAGES
// ============================================

export const MESSAGES = {
  loading: 'Loading...',
  error: 'Something went wrong. Please try again.',
  success: 'Success!',
  noResults: 'No results found.',
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  addedToCart: 'Added to cart successfully!',
  removedFromCart: 'Removed from cart',
  updateCartError: 'Failed to update cart',
}

// ============================================
// RESPONSIVE BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const LOCAL_STORAGE_KEYS = {
  CART: 'social_flowers_cart',
  AUTH_TOKEN: 'social_flowers_token',
  USER: 'social_flowers_user',
  PREFERENCES: 'social_flowers_preferences',
}

// ============================================
// VALIDATION
// ============================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s()+-]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRES: {
    uppercase: true,
    number: true,
    specialChar: false,
  },
}
