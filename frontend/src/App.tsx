import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import BestSellersPage from '@/pages/BestSellersPage'
import ShopPage from '@/pages/ShopPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:slug" element={<ShopPage />} />
      <Route path="/best-sellers" element={<BestSellersPage />} />
      <Route path="/item/:itemCode/:slug" element={<ProductDetailPage />} />
      <Route path="/item/:itemCode" element={<ProductDetailPage />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App