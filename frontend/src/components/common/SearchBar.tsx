/**
 * Search Bar Component
 * Search input with autocomplete and search functionality
 */

import React, { useState } from 'react'
import { cn } from '@/utils/cn'

interface SearchBarProps {
  onSearch?: (query: string) => void
  onSubmit?: (query: string) => void
  placeholder?: string
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSubmit,
  placeholder = 'Search flowers, occasions...',
  className,
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (value: string) => {
    setQuery(value)
    onSearch?.(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all duration-200"
        />

        {/* Search Icon/Button */}
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {/* Autocomplete Dropdown (optional) */}
      {isFocused && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-10">
          <div className="p-3 text-sm text-gray-600">
            <p className="font-medium mb-2">Popular searches</p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setQuery('Roses')
                  onSubmit?.('Roses')
                }}
                className="block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700"
              >
                🌹 Roses
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setQuery('Sunflowers')
                  onSubmit?.('Sunflowers')
                }}
                className="block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700"
              >
                🌻 Sunflowers
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setQuery('Tulips')
                  onSubmit?.('Tulips')
                }}
                className="block w-full text-left px-3 py-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700"
              >
                🌷 Tulips
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

SearchBar.displayName = 'SearchBar'
export default SearchBar
