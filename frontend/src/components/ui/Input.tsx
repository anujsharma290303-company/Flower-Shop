/**
 * Input Component
 * Text input field with multiple types, validation, and states
 */

import React from 'react'
import { cn } from '@/utils/cn'
import { InputProps } from '@/types'

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  required = false,
  className,
  icon,
  helper,
}) => {
  const inputClasses = cn(
    // Base styles
    'w-full h-10 px-3 py-2 text-base font-normal rounded-lg border-2 transition-all duration-200',
    'placeholder-gray-500 focus:outline-none',
    // Border and focus states
    error ? 'border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100' : 'border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100',
    // Disabled state
    disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-60',
    // Icon padding
    Boolean(icon) && 'pl-10',
    className,
  )

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{icon}</div>}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={inputClasses}
        />
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helper && !error && <p className="text-sm text-gray-500 mt-1">{helper}</p>}
    </div>
  )
}

Input.displayName = 'Input'
export default Input
