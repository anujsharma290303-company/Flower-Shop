/**
 * API Services Index
 * Barrel export for all API service files
 */

export { productService, default as products } from './products'
export { categoryService, default as categories } from './categories'
export { siteConfigService, default as siteConfig } from './site-config'
export { faqService, default as faqs } from './faqs'
export { reviewService, default as reviews } from './reviews'

export * from './products'
export * from './categories'
export * from './site-config'
export * from './faqs'
export * from './reviews'
