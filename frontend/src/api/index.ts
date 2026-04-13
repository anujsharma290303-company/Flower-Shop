/**
 * API Services Index
 * Barrel export for all API service files
 */

export { productService, default as products } from './products'
export { categoryService, default as categories } from './categories'
export { siteConfigService, default as siteConfig } from './site-config'
export { faqService, default as faqs } from './faqs'
export { reviewService, default as reviews } from './reviews'
export { authService, default as auth } from './auth'
export { blogService, default as blogs } from './blogs'
export { flowerMeService, default as flowerme } from './flowerme'
export { adminService, default as admin, ADMIN_ENDPOINT_CATALOG } from './admin'
export { orderService, default as orders } from './orders'

export * from './products'
export * from './categories'
export * from './site-config'
export * from './faqs'
export * from './reviews'
export * from './auth'
export * from './blogs'
export * from './flowerme'
export * from './admin'
export * from './orders'
