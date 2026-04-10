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
  const { categories } = useCategories()

  const navLinks = SOCIAL_FLOWERS_HOMEPAGE.navigation
  const isLoggedIn = authService.isLoggedIn()
  const accountHref = isLoggedIn ? '/my-profile' : '/sign-in'
  const shopCategories = categories.slice(0, 12).map((category) => ({
    label: category.name,
    href: `/shop/${category.slug}`,
  }))

  const handleSignOut = () => {
    authService.clearSession()
    setMobileMenuOpen(false)
    navigate('/sign-in')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-270 mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-17">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img
              src={SOCIAL_FLOWERS_HOMEPAGE.logoUrl}
              alt="Social Flowers"
              className="h-11 md:h-12 w-auto"
              loading="eager"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-7">
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
                      className="text-[16px] font-semibold text-gray-800 hover:text-red-600 transition-colors"
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
                  className="text-[16px] font-semibold text-gray-800 hover:text-red-600 transition-colors"
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right Icon */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/flowerme/profile" className="hidden md:inline-flex text-[14px] font-semibold text-gray-800 hover:text-red-600 transition-colors">
                  My FlowerMe
                </Link>
                <Link to="/my-orders" className="hidden md:inline-flex text-[14px] font-semibold text-gray-800 hover:text-red-600 transition-colors">
                  My Orders
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hidden md:inline-flex text-[14px] font-semibold text-gray-800 hover:text-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : null}

            <Link
              to={accountHref}
              aria-label={isLoggedIn ? 'My Profile' : 'Sign In'}
              className="hidden md:inline-flex text-gray-800 hover:text-red-600 transition-colors"
            >
              <span className="sr-only">{isLoggedIn ? 'My Profile' : 'Sign In'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

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
              {shopCategories.map((category) => (
                <Link key={category.href} to={category.href} className="text-gray-700 hover:text-red-600 text-sm pl-3">
                  {category.label}
                </Link>
              ))}
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
                <Link to={accountHref} className="text-gray-800 hover:text-red-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
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
