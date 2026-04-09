/**
 * Badge Component
 * Status badges, rating badges, and tags
 */

import React from 'react'
import { cn } from '@/utils/cn'
import { BadgeProps } from '@/types'

const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', size = 'md', className }) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  }

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
    lg: 'px-4 py-2 text-base font-medium',
  }

  const badgeClasses = cn(
    'inline-block rounded-full',
    variantStyles[variant],
    sizeStyles[size],
    className,
  )

  return <span className={badgeClasses}>{label}</span>
}

Badge.displayName = 'Badge'
export default Badge
