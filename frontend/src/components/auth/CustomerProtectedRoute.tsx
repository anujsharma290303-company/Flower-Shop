import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '@/api/auth'

type CustomerProtectedRouteProps = {
  children: React.ReactElement
}

const CustomerProtectedRoute: React.FC<CustomerProtectedRouteProps> = ({ children }) => {
  const location = useLocation()

  if (!authService.isLoggedIn()) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{
          notice: 'Please sign in first to access this page.',
          from: location.pathname,
        }}
      />
    )
  }

  return children
}

CustomerProtectedRoute.displayName = 'CustomerProtectedRoute'
export default CustomerProtectedRoute
