/**
 * Modal Component
 * Dialog modal with backdrop and size options
 */

import React, { useEffect } from 'react'
import { cn } from '@/utils/cn'
import type { ModalProps } from '@/types'
import Button from './Button'

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', className }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  // Size styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            'bg-white rounded-lg shadow-xl w-full',
            sizeStyles[size],
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">{children}</div>

          {/* Footer (optional) */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <Button variant="secondary" label="Close" onClick={onClose} />
          </div>
        </div>
      </div>
    </>
  )
}

Modal.displayName = 'Modal'
export default Modal
