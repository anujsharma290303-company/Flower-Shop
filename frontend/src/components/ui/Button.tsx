/**
 * Button Component
 * Primary reusable button with multiple variants and sizes
 */

import React from 'react'
import { cn } from '@/utils/cn'
import { ButtonProps } from '@/types'

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className,
  children,
  type = 'button',
  fullWidth = false,
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed'

  // Variant styles
  const variantStyles = {
    primary: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:text-gray-200',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 disabled:border-gray-400 disabled:text-gray-400',
    ghost: 'text-red-600 hover:bg-red-50 hover:underline active:bg-red-100 disabled:text-gray-400',
  }

  // Size styles
  const sizeStyles = {
    xs: 'px-3 py-1 text-xs gap-1',
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2',
  }

  // Disabled state
  const disabledClass = disabled || loading ? 'opacity-60' : ''

  const buttonClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    disabledClass,
    className,
  )

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading ? (
        <>
          <svg
            className="w-4 h-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {label && <span>{label}</span>}
        </>
      ) : (
        <>
          {icon && <span className="flex items-center justify-center">{icon}</span>}
          {label || children}
        </>
      )}
    </button>
  )
}

Button.displayName = 'Button'
export default Button
