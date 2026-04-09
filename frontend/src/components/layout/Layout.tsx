/**
 * Layout Component
 * Main page wrapper with Navigation and Footer
 */

import React from 'react'
import Navigation, { type NavigationProps } from './Navigation'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  navigationProps?: NavigationProps
  showFooter?: boolean
}

const Layout: React.FC<LayoutProps> = ({
  children,
  navigationProps,
  showFooter = true,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <Navigation {...navigationProps} />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}

Layout.displayName = 'Layout'
export default Layout
