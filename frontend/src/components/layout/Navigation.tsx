/**
 * Navigation Bar Component
 * Global header with logo, search, categories, account, and cart
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { SOCIAL_FLOWERS_HOMEPAGE } from '@/utils/socialflowersHomepage'
import { useCategories } from '@/hooks/useCategories'
import { authService } from '@/api/auth'
import { useBouquetStore } from '../../store/bouquetStore'

export interface NavigationProps {
  cartCount?: number
  isLoggedIn?: boolean
  userName?: string
  onLogout?: () => void
}

const Navigation: React.FC<NavigationProps> = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shopMenuOpen, setShopMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const { categories } = useCategories()
  const { cartItems } = useBouquetStore()
  const cartCount = cartItems.reduce((sum, item) => sum + (item.type === 'bouquet' ? 1 : item.quantity), 0)

  const navLinks = SOCIAL_FLOWERS_HOMEPAGE.navigation
  const isLoggedIn = authService.isLoggedIn()
  const shopCategories = categories.slice(0, 12).map((category) => ({
    label: category.name,
    href: `/shop/${category.slug}`,
  }))
  const customBouquetShopLinks = [
    { label: "Recipient's Choice: Custom Bouquet", href: '/create-a-bouquet?type=recipient' },
    { label: "Sender's Choice: Custom Bouquet", href: '/create-a-bouquet?type=sender' },
  ]

  const handleSignOut = () => {
    authService.clearSession()
    setMobileMenuOpen(false)
    navigate('/sign-in')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-270 mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-22 md:h-24 gap-5">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <span className="block w-26 h-16 md:w-40 md:h-22 overflow-hidden">
            <img
              src={SOCIAL_FLOWERS_HOMEPAGE.logoUrl}
              alt="Social Flowers"
              className="w-full h-full object-contain object-left scale-[1.5] md:scale-[1.6] origin-left"
              loading="eager"
            />
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => {
              if (link.label === 'Shop') {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setShopMenuOpen(true)}
                    onMouseLeave={() => setShopMenuOpen(false)}
                  >
                    <Link
                      to="/shop"
                      className="whitespace-nowrap text-[18px] font-semibold text-gray-800 hover:text-red-600 transition-colors"
                      onFocus={() => setShopMenuOpen(true)}
                    >
                      Shop
                    </Link>

                    {shopMenuOpen && (
                      <div className="absolute left-0 top-full pt-1 w-66 z-50">
                        <div className="border border-gray-200 bg-[#efefef] shadow-sm py-2">
                          <Link
                            to="/best-sellers"
                            className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600"
                          >
                            Best Sellers
                          </Link>
                          {customBouquetShopLinks.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600"
                            >
                              {item.label}
                            </Link>
                          ))}
                          {shopCategories.map((category) => (
                            <Link
                              key={category.href}
                              to={category.href}
                              className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600"
                            >
                              {category.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="whitespace-nowrap text-[18px] font-semibold text-gray-800 hover:text-red-600 transition-colors"
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right Icon */}
          <div className="flex items-center gap-3">
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setAccountMenuOpen(true)}
              onMouseLeave={() => setAccountMenuOpen(false)}
            >
              <button
                type="button"
                aria-label={isLoggedIn ? 'My Profile menu' : 'Sign In menu'}
                className="inline-flex text-gray-800 hover:text-red-600 transition-colors"
                onClick={() => setAccountMenuOpen((open) => !open)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 w-56 pt-1">
                  <div className="border border-gray-200 bg-[#efefef] py-2 shadow-sm">
                    <Link to="/create-a-bouquet?type=sender" className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600" onClick={() => setAccountMenuOpen(false)}>
                      Build Bouquet
                    </Link>
                    <Link to="/cart" className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600" onClick={() => setAccountMenuOpen(false)}>
                      Cart {cartCount > 0 ? `(${cartCount})` : ''}
                    </Link>
                    {isLoggedIn ? (
                      <>
                        <Link to="/my-profile" className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600" onClick={() => setAccountMenuOpen(false)}>
                          Account Info
                        </Link>
                        <Link to="/flowerme/profile" className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600" onClick={() => setAccountMenuOpen(false)}>
                          FlowerMe Profile
                        </Link>
                        <Link to="/my-orders" className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600" onClick={() => setAccountMenuOpen(false)}>
                          Orders Placed
                        </Link>
                        <Link to="/track-order" className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600" onClick={() => setAccountMenuOpen(false)}>
                          Track Order
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="block w-full px-3 py-1.5 text-left text-[16px] text-gray-700 hover:text-red-600"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link to="/sign-in" className="block px-3 py-1.5 text-[16px] text-gray-700 hover:text-red-600" onClick={() => setAccountMenuOpen(false)}>
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className={cn('w-6 h-6 transition-transform', {
                  'transform rotate-180': mobileMenuOpen,
                })}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.label === 'Shop' ? '/shop' : link.href}
                  className="text-gray-800 hover:text-red-600 font-medium py-1"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/best-sellers" className="text-gray-700 hover:text-red-600 text-sm pl-3">
                Best Sellers
              </Link>
              {customBouquetShopLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-700 hover:text-red-600 text-sm pl-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {shopCategories.map((category) => (
                <Link
                  key={category.href}
                  to={category.href}
                  className="text-gray-700 hover:text-red-600 text-sm pl-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.label}
                </Link>
              ))}
              <Link to="/create-a-bouquet?type=sender" className="text-gray-800 hover:text-red-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                Sender Builder
              </Link>
              <Link to="/create-a-bouquet?type=recipient" className="text-gray-800 hover:text-red-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                Recipient Builder
              </Link>
              <Link to="/cart" className="text-gray-800 hover:text-red-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                Cart ({cartCount})
              </Link>
              {isLoggedIn ? (
                <>
                  <Link to="/flowerme/profile" className="text-gray-800 hover:text-red-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                    My FlowerMe
                  </Link>
                  <Link to="/my-orders" className="text-gray-800 hover:text-red-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                  <button type="button" onClick={handleSignOut} className="text-left text-gray-800 hover:text-red-600 font-medium py-1">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/sign-in" className="text-gray-800 hover:text-red-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

Navigation.displayName = 'Navigation'
export default Navigation
