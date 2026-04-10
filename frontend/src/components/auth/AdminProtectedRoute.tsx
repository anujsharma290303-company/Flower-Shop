import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { adminService } from '@/api/admin'

type AdminProtectedRouteProps = {
  children: React.ReactElement
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const location = useLocation()

  if (!adminService.isLoggedIn()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}

AdminProtectedRoute.displayName = 'AdminProtectedRoute'
export default AdminProtectedRoute
