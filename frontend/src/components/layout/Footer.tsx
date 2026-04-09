/**
 * Footer Component
 * Multi-column footer with shop, company, uses, and social links
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { SHOP_CATEGORIES, COMPANY_LINKS, USES_LINKS } from '@/utils/constants'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const socialIconMap = {
  twitter: FaXTwitter,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
} as const

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const { socialLinks } = useSiteConfig()

  return (
    <footer className="relative overflow-hidden bg-[#15171d] text-gray-100">
      <div className="pointer-events-none absolute -left-36 -top-24 w-95 h-55 rounded-full bg-[#20232b]" />
      <div className="pointer-events-none absolute -right-36 -bottom-28 w-105 h-65 rounded-full bg-[#20232b]" />

      <div className="relative max-w-245 mx-auto px-4 md:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-[14px] uppercase font-semibold tracking-wide text-white mb-4">Follow Us:</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.platform as keyof typeof socialIconMap]

                if (!Icon) {
                  return null
                }

                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#313540] bg-[#1c1f26] text-gray-300 transition-colors hover:border-red-500 hover:bg-red-600 hover:text-white"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-[14px] uppercase font-semibold tracking-wide text-white mb-4">Shop</h3>
            <ul className="space-y-1">
              {SHOP_CATEGORIES.map((category) => (
                <li key={category.href}>
                  <Link to={category.href} className="text-[18px] text-gray-300 hover:text-white transition-colors">
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[14px] uppercase font-semibold tracking-wide text-white mb-4">Company</h3>
            <ul className="space-y-1">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[18px] text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-[18px] text-gray-300 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[14px] uppercase font-semibold tracking-wide text-white mb-4">Uses</h3>
            <ul className="space-y-1">
              {USES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-[18px] text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2c3038] mt-10 pt-6">
          <p className="text-[14px] text-gray-400 text-center md:text-left">
            © {currentYear} Social Flowers by{' '}
            <a href="https://www.floristone.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              Florist One
            </a>
            {' '}| Popular Cities:{' '}
            <Link to="/local-florist-delivery" aria-label="Popular Cities Local Florist Delivery" className="text-gray-300 hover:text-white">
              Local Florist Delivery
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

Footer.displayName = 'Footer'
export default Footer
